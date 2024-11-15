// import React, { useState, useRef, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { PhoneOff } from "lucide-react"

// export default function NewComponent() {
//   const [duration, setDuration] = useState(0)
//   const videoRef = useRef(null)

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//         }
//       })
//       .catch(err => console.error("Error accessing media devices:", err))

//     const timer = setInterval(() => {
//       setDuration(prev => prev + 1)
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}m ${remainingSeconds}s`
//   }

//   return (
//     <div className="h-screen bg-[#1a1a2e] p-4 flex flex-col">
//       <div className="flex-grow flex space-x-4 mb-12 mt-16">
//         <div className="w-1/2 bg-[#16213e] rounded-lg overflow-hidden relative">
//           <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//           <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             Duration: {formatDuration(duration)}
//           </div>
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             You
//           </div>
//         </div>
//         <div className="w-1/2 bg-[#16213e] rounded-lg overflow-hidden relative">
//           <img 
//             src="/placeholder.svg?height=1000&width=1000" 
//             alt="Saksham" 
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             Saksham
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center mb-4">
//         <Button 
//           onClick={() => console.log("End Call")} 
//           className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-full"
//         >
//           <PhoneOff className="mr-2 h-4 w-4" />
//           End Call
//         </Button>
//       </div>
//     </div>
//   )
// }
// import React, { useState, useRef, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Phone } from "lucide-react"

// export default function NewComponent() {
//   const [duration, setDuration] = useState(0)
//   const videoRef = useRef(null)

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//         }
//       })
//       .catch(err => console.error("Error accessing media devices:", err))

//     const timer = setInterval(() => {
//       setDuration(prev => prev + 1)
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}m ${remainingSeconds}s`
//   }

//   return (
//     <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
//       <div className="flex-grow flex justify-center items-center space-x-8 mb-4">
//         <div className="w-[30rem] h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//           <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//           <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             Duration: {formatDuration(duration)}
//           </div>
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             You
//           </div>
//         </div>
//         <div className="w-[30rem] h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//           <img
//             src="/api/placeholder/800/600"
//             alt="Saksham"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             Saksham
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center mb-8">
//         <Button
//           onClick={() => console.log("End Call")}
//           className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//         >
//           <Phone className="mr-2 h-5 w-5 rotate-180" />
//           End Call
//         </Button>
//       </div>
//     </div>
//   )
// }

// import React, { useState, useRef, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Phone, Maximize2 } from "lucide-react"

// export default function NewComponent() {
//   const [duration, setDuration] = useState(0)
//   const videoRef = useRef(null)
//   const timerRef = useRef(null)

//   useEffect(() => {
//     // Try to enter fullscreen on component mount
//     const enterFullscreen = () => {
//       const element = document.documentElement
//       if (element.requestFullscreen) {
//         element.requestFullscreen().catch(err => console.error("Error entering fullscreen:", err))
//       } else if (element.webkitRequestFullscreen) {
//         element.webkitRequestFullscreen().catch(err => console.error("Error entering fullscreen:", err)) // Safari
//       } else if (element.msRequestFullscreen) {
//         element.msRequestFullscreen().catch(err => console.error("Error entering fullscreen:", err)) // IE/Edge
//       }
//     }

//     enterFullscreen()

//     // Start video stream and timer regardless of fullscreen status
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//         }
//       })
//       .catch(err => console.error("Error accessing media devices:", err))

//     // Start timer
//     timerRef.current = setInterval(() => {
//       setDuration(prev => prev + 1)
//     }, 1000)

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current)
//     }
//   }, [])

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}m ${remainingSeconds}s`
//   }

//   const handleFullscreen = () => {
//     const element = document.documentElement
//     if (element.requestFullscreen) {
//       element.requestFullscreen().catch(err => console.error("Error entering fullscreen:", err))
//     } else if (element.webkitRequestFullscreen) {
//       element.webkitRequestFullscreen().catch(err => console.error("Error entering fullscreen:", err))
//     } else if (element.msRequestFullscreen) {
//       element.msRequestFullscreen().catch(err => console.error("Error entering fullscreen:", err))
//     }
//   }

//   return (
//     <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
//       <div className="absolute top-2 right-2 z-50">
//         <button 
//           onClick={handleFullscreen} 
//           className="bg-black bg-opacity-50 text-white p-2 rounded-full shadow-lg hover:bg-opacity-70"
//         >
//           <Maximize2 className="w-6 h-6" />
//         </button>
//       </div>
//       <div className="flex-grow flex justify-center items-center space-x-8 mb-4">
//         <div className="w-[30rem] h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//           <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//           <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             Duration: {formatDuration(duration)}
//           </div>
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             You
//           </div>
//         </div>
//         <div className="w-[30rem] h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//           <img
//             src="/api/placeholder/800/600"
//             alt="Saksham"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//             Saksham
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center mb-16"> {/* Move button higher */}
//         <Button
//           onClick={() => console.log("End Call")}
//           className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//         >
//           <Phone className="mr-2 h-5 w-5 rotate-180" />
//           End Call
//         </Button>
//       </div>
//     </div>
//   )
// }

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Phone, Maximize2 } from "lucide-react"

export default function VideoConference() {
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false) // Track recording state
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const [recordedChunks, setRecordedChunks] = useState([])

  const handleRecording = (stream) => {
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    }
    mediaRecorder.start()
    setIsRecording(true)
  }

  const enterFullscreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err))
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err))
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err))
    }
  }

  useEffect(() => {
    if (isFullscreen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
          // Start recording when fullscreen is entered
          handleRecording(stream)

          // Start timer
          timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
          }, 1000)
        })
        .catch(err => console.error("Error accessing media devices:", err))
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isFullscreen])

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recording.webm'
    a.click()
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <Button
            onClick={enterFullscreen}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <Maximize2 className="mr-2 h-5 w-5" />
            Enter Fullscreen
          </Button>
        </div>
      )}

      {isFullscreen && (
        <div className="flex-grow flex justify-center items-center space-x-8 mb-4">
          {/* User Video */}
          <div className="w-[30rem] h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              Duration: {formatDuration(duration)}
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              You
            </div>
          </div>

          {/* Placeholder for the other participant */}
          <div className="w-[30rem] h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
            <img
              src="/api/placeholder/800/600"
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
        <div className="flex justify-center mb-16 space-x-4">
          <Button
            onClick={() => {
              handleStopRecording()
              console.log("End Call")
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <Phone className="mr-2 h-5 w-5 rotate-180" />
            End Call
          </Button>

          {isRecording && (
            <Button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Download Recording
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
