import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';  // קומפוננטת התחברות
import SignUp from './components/SignUp/SignUp';  // קומפוננטת הרשמה



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
