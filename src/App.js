import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';  // קומפוננטת התחברות
import SignUpDetails from './components/SignUp/DetailsPhase/SignUpDetails';  
import SignUpCode from './components/SignUp/CodePhase/SignUpCode'; 
import SignUpTerms from './components/SignUp/TermsPhase/SignUpTerms'; 
import Home from './components/Home/Home';  // קומפוננטת דף הבית
import OpenCourse from './components/OpenCourse/OpenCourse'; // ייבוא הדף החדש
import UploadQuestionDate from './components/UploadQuestion/UploadQuestionDate/UploadQuestionDate'; // ייבוא הדף החדש
import UploadQuestionContent from './components/UploadQuestion/UploadQuestionContent/UploadQuestionContent'; // ייבוא הדף החדש
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
        <Route path="/upload-question-date/:courseName" element={<UploadQuestionDate />} /> {/* דף הקורס */}
        <Route path="/upload-question-content/:courseName/:examYear/:examSemester/:examDateSelection/:questionNum" element={<UploadQuestionContent />} /> {/* דף הקורס */}
        <Route path="/course/:courseName" element={<Course />} /> {/* דף הקורס */}
      </Routes>
    </Router>
  );
}

export default App;
