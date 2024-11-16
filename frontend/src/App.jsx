import { useState } from 'react'
// import Signin from './pages/Signin'
// import Signup from './pages/Signup'
import Chat from './pages/Chat';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'


import VideoConference from './components/UpdatedComponent';
import DealDetailsForm from './pages/Test';
import CalenderDemo from './pages/CalenderDemo';

function App() {
  return (
   <GoogleOAuthProvider clientId='951522285736-dge67ps62hcv421d7qcbqdv64vp9gusl.apps.googleusercontent.com'>
    <Router>
      <Routes>
      {/* <Route path='/interview/:interviewId' element={<VideoConference/>} /> */}
      <Route path='/interview' element={<VideoConference/>} />
      </Routes>
    </Router>
   </GoogleOAuthProvider>
  )
}

export default App

/*       <Route path='/'  />

      <Route path='/deal/:dealId' element={< DealDetailsForm/>}/>
      <Route path='/calender' element={< CalenderDemo/>}/> */
