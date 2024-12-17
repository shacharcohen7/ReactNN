import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';  // קומפוננטת התחברות
import SignUpDetails from './components/SignUp/DetailsPhase/SignUpDetails';  
import SignUpCode from './components/SignUp/CodePhase/SignUpCode'; 
import SignUpTerms from './components/SignUp/TermsPhase/SignUpTerms'; 
import Home from './components/Home/Home';  // קומפוננטת דף הבית
import OpenCourse from './components/OpenCourse/OpenCourse'; // ייבוא הדף החדש
import UploadQuestion from './components/UploadQuestion/UploadQuestion'; // ייבוא הדף החדש
import Course from './components/Course/Course'; // ייבוא דף הקורס

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signupdetails" element={<SignUpDetails />} />
        <Route path="/signupcode" element={<SignUpCode />} />
        <Route path="/signupterms" element={<SignUpTerms />} />
        <Route path="/home" element={<Home />} />
        <Route path="/opencourse" element={<OpenCourse />} /> {/* מסלול לדף הוספת קורס */}
        <Route path="/upload-question/:courseName" element={<UploadQuestion />} /> {/* דף הקורס */}
        <Route path="/course/:courseName" element={<Course />} /> {/* דף הקורס */}
      </Routes>
    </Router>
  );
}

export default App;
