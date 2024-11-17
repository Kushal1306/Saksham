import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Maximize2, Mic, MicOff } from "lucide-react";
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import dotenv from 'dotenv'

// dotenv.config();

export default function VideoConference() {
  // console.log(process.env.VITE_BACKEND_URL);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const interviewId = queryParams.get('interviewId');
  // const { interviewId } = useParams();
  const [duration, setDuration] = useState(0);
  const [validity, setValidity] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const navigate = useNavigate();
  const [dialog, setDialog] = useState('');

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Audio processing refs
  const ws = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    const getInterviewData = async (interviewId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/saksham/interview/${interviewId}`);
        console.log(response);
        if (response.data.success)
          setValidity(true);

        setDialog(response.data.message);

      } catch (error) {

        console.log("error occured:", error.message);
        setDialog(error.response.data.message);
      }
    };
    getInterviewData(interviewId);
  }, []);
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err));
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error("Error exiting fullscreen:", err));
    }
  };

  const initWebSocket = () => {
    ws.current = new WebSocket(`wss://saksham-rplr.onrender.com/websocket/${interviewId}`);
    // ws.current = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}/websocket/${interviewId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      ws.current.send(JSON.stringify({
        event: 'start',
        message: 'Connection initialized',
      }));
      startAudio();
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'ping') {
        ws.send(JSON.stringify({ event: 'pong' }));
        console.log(`Sent pong to interview ${interviewId}`);
      }
      if (message.event === 'media') {
        console.log("Media received");

        const binaryString = atob(message.media.payload);
        const byteArray = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = audioUrl;
          audioPlayerRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        }
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsAudioOn(true);

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorNodeRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);

      sourceNodeRef.current.connect(processorNodeRef.current);
      processorNodeRef.current.connect(audioContextRef.current.destination);

      processorNodeRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = convertFloat32ToInt16(inputData);
        sendAudioChunk(audioData);
      };

    } catch (error) {
      console.error('Error accessing audio:', error);
    }
  };
  
  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsAudioOn(false);
  };

  const convertFloat32ToInt16 = (buffer) => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
  };

  const sendAudioChunk = (audioData) => {
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        event: 'media',
        media: {
          payload: audioBase64,
        },
      }));
    }
  };

  // 
  

  useEffect(() => {
    if (isFullscreen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          // handleRecording(stream);
          initWebSocket();

          timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
          }, 1000);
        })
        .catch(err => console.error("Error accessing media devices:", err));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isFullscreen) {
        stopAudio();
        if (ws.current) {
          ws.current.close();
        }
      }
    };
  }, [isFullscreen]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // const handleStopRecording = () => {
  //   if (mediaRecorderRef.current) {
  //     mediaRecorderRef.current.stop();
  //     setIsRecording(false);
  //   }
  // };

  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
  };
  
  const stopVideo = () => {
    const videoTracks = videoRef.current?.srcObject?.getTracks().filter(track => track.kind === 'video');
    videoTracks.forEach(track => track.stop()); // Stop the video track
  };

  const handleEndCall = () => {
    // handleStopRecording();
    stopAudio();
    stopVideo();
    if (ws.current) {
      ws.current.close();
    }
    navigate(`/feedback?interviewId=${interviewId}`);
    exitFullscreen();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
      {!isFullscreen && validity && (
        <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
          <div className='pl-2 text-white'>{dialog}</div>
          <Button
            onClick={enterFullscreen}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <Maximize2 className="mr-2 h-5 w-5" />
            Enter Fullscreen
          </Button>
        </div>
      )}
      {!validity && (
        <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
          <div className='pl-2 text-white'>{dialog}</div>
        </div>

      )
      }

      {isFullscreen && (
        <div className="flex-grow flex justify-center items-center space-x-8 mb-2">
          {/* User Video */}
          <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              Duration: {formatDuration(duration)}
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              You
            </div>
          </div>

          {/* Placeholder for the other participant */}
          <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
            <img
              src="/images/saksham.jpeg"
              alt="Saksham"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              Saksham
            </div>
          </div>
        </div>
      )}

      {isFullscreen && (
        <div className="flex justify-center mb-24 space-x-4">
          <Button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            {isAudioOn ? (
              <Mic className="mr-2 h-5 w-5" />
            ) : (
              <MicOff className="mr-2 h-5 w-5" />
            )}
            {isAudioOn ? 'Mute' : 'Unmute'}
          </Button>

          <Button
            onClick={handleEndCall}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <Phone className="mr-2 h-5 w-5 rotate-180" />
            End Call
          </Button>

          {/* {isRecording && (
            <Button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Download Recording
            </Button>
          )} */}
        </div>
      )}

      <audio ref={audioPlayerRef} controls style={{ display: 'none' }} />
    </div>
  );
}