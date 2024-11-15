// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Mic, MicOff, Video, VideoOff, Share2, PhoneOff, Send } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function VideoConferenceComponent() {
//   const { interviewId } = useParams(); // Extract interview ID from URL parameters
//   const [audioStream, setAudioStream] = useState(null);
//   const [isAudioOn, setIsAudioOn] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const ws = useRef(null); // WebSocket reference
//   const mediaRecorderRef = useRef(null); // MediaRecorder reference
//   const audioPlayerRef = useRef(null); // Audio element reference

//   // Initialize WebSocket connection
//   const initWebSocket = () => {
//     console.log(interviewId);
//     ws.current = new WebSocket(`ws://localhost:3000/websocket/${interviewId}`);


//     ws.current.onopen = () => {
//       console.log('WebSocket connection established');
//       // Optionally send a message upon connection if needed
//     };

//     ws.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       // Handle incoming media
//       if (message.event === 'media') {
//         const audioBlob = new Blob([new Uint8Array(message.media.payload)], { type: 'audio/wav' }); // Adjust type as needed
//         const audioUrl = URL.createObjectURL(audioBlob);
//         if (audioPlayerRef.current) {
//           audioPlayerRef.current.src = audioUrl;
//           audioPlayerRef.current.play();
//         }
//       }
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket connection closed');
//     };
//   };

//   // Start sending audio continuously
//   const startAudio = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setAudioStream(stream);
//       setIsAudioOn(true);
      
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorder.start(1000); // Send audio data every second
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           sendAudio(event.data);
//         }
//       };

//     } catch (error) {
//       console.error('Error accessing audio:', error);
//     }
//   };

//   const stopAudio = () => {
//     if (audioStream) {
//       audioStream.getTracks().forEach((track) => track.stop());
//       setAudioStream(null);
//       setIsAudioOn(false);
//       if (mediaRecorderRef.current) {
//         mediaRecorderRef.current.stop();
//       }
//     }
//   };

//   const sendAudio = (audioData) => {
//     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const audioBase64 = reader.result.split(',')[1]; // Get the Base64 string from Data URL
//         ws.current.send(JSON.stringify({
//           event: 'media',
//           media: {
//             payload: audioBase64
//           }
//         }));
//       };
//       reader.readAsDataURL(audioData); // Convert Blob to Data URL for Base64
//     }
//   };

//   const sendMessage = () => {
//     if (newMessage.trim()) {
//       const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       setMessages([...messages, { sender: 'Candidate', text: newMessage, time: currentTime }]);
//       setNewMessage('');
//       // Optionally send the message to the server here
//     }
//   };

//   useEffect(() => {
//     initWebSocket();
//     return () => {
//       stopAudio();
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
//       <div className="flex-1 flex flex-col">
//         <div className="bg-white p-4 shadow-sm">
//           <h1 className="text-2xl font-bold">AI-Assisted Interview</h1>
//           <p className="text-sm text-gray-500">Candidate Interview Session ID: {interviewId}</p>
//         </div>
//         <div className="flex-1 p-4 flex relative">
//           <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
//             <video
//               ref={audioPlayerRef}
//               autoPlay
//               playsInline
//               className="absolute inset-0 w-full h-full object-cover"
//             ></video>
//             {/* Video controls go here */}
//           </div>
//         </div>
//         <div className="bg-white p-4 flex justify-center space-x-4">
//           <Button variant="outline" size="icon" onClick={isAudioOn ? stopAudio : startAudio}>
//             {isAudioOn ? (
//               <Mic className="h-4 w-4 text-green-500" />
//             ) : (
//               <MicOff className="h-4 w-4 text-red-500" />
//             )}
//           </Button>
//           {/* Other buttons like Video, Share, and Hangup */}
//         </div>
//       </div>
//       <div className="w-96 bg-white border-l flex flex-col">
//         <div className="p-4 border-b">
//           <h2 className="font-semibold">Chat with AI Assistant</h2>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${message.sender === 'Candidate' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-[70%] rounded-lg p-3 ${
//                   message.sender === 'Candidate' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                 }`}
//               >
//                 <p className="text-sm">{message.text}</p>
//                 <p className="text-xs mt-1 opacity-70">{message.time}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="p-4 border-t">
//           <div className="flex items-center space-x-2">
//             <Input
//               placeholder="Type your message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             />
//             <Button onClick={sendMessage}>
//               <Send className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       <audio ref={audioPlayerRef} controls style={{ display: 'none' }} />
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Video, VideoOff, Share2, PhoneOff, Send } from 'lucide-react';
import { useParams } from 'react-router-dom';


export default function VideoConferenceComponent() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const { interviewId } = useParams(); // Extract interview ID from URL parameters

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    initWebSocket();
    return () => {
      stopAudio();
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const initWebSocket = () => {
    ws.current = new WebSocket(`ws://localhost:3000/websocket/${interviewId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      startAudio();
    };

    // ws.current.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   if (message.event === 'media') {
    //     console.log("media received");
    //     const audioBlob = new Blob([Buffer.from(message.media.payload, 'base64')], { type: 'audio/wav' });
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     if (audioPlayerRef.current) {
    //       audioPlayerRef.current.src = audioUrl;
    //       audioPlayerRef.current.play();
    //     }
    //   }
    // };
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'media') {
          console.log("Media received");
  
          // Decode the base64 payload into a byte array
          const binaryString = atob(message.media.payload); 
          const byteArray = new Uint8Array(binaryString.length);
  
          for (let i = 0; i < binaryString.length; i++) {
              byteArray[i] = binaryString.charCodeAt(i);
          }
  
          // Create a Blob from the byte array
          const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
  
          // Play the audio using the audio player reference
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

  // const sendAudioChunk = (audioData) => {
  //   if (ws.current && ws.current.readyState === WebSocket.OPEN) {
  //     const audioBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(audioData)));
  //     ws.current.send(JSON.stringify({
  //       event: 'media',
  //       media: {
  //         payload: audioBase64
  //       }
  //     }));
  //   }
  // };
  const sendAudioChunk = (audioData) => {
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    // console.log("Sending audio chunk:", audioBase64);  // Debug log for the audio data

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
            event: 'media',
            media: {
                payload: audioBase64,
            },
        }));
    }
};


  const sendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { sender: 'Candidate', text: newMessage, time: currentTime }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold">AI-Assisted Interview</h1>
          <p className="text-sm text-gray-500">Candidate Interview Session ID: {interviewId}</p>
        </div>
        <div className="flex-1 p-4 flex relative">
          <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
            <video
              ref={audioPlayerRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
          </div>
        </div>
        <div className="bg-white p-4 flex justify-center space-x-4">
          <Button variant="outline" size="icon" onClick={isAudioOn ? stopAudio : startAudio}>
            {isAudioOn ? (
              <Mic className="h-4 w-4 text-green-500" />
            ) : (
              <MicOff className="h-4 w-4 text-red-500" />
            )}
          </Button>
        </div>
      </div>
      <div className="w-96 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Chat with AI Assistant</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'Candidate' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'Candidate' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <audio ref={audioPlayerRef} controls style={{ display: 'none' }} />
    </div>
  );
}