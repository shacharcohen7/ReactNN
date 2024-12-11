import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';  // קומפוננטת התחברות
import SignUp from './components/SignUp/SignUp';  // קומפוננטת הרשמה
import Home from './components/Home/Home';  // קומפוננטת דף הבית



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
