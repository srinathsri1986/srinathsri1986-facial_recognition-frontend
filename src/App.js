import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CandidateLogin from "./components/CandidateLogin";
import CandidateSignup from "./components/CandidateSignup";
import CandidateDashboard from "./components/CandidateDashboard";
import CandidateDetails from "./components/CandidateDetails";
import HRLogin from "./components/HRLogin";
import HRDashboard from "./components/HRDashboard";
import HRCandidateDetails from "./components/HRCandidateDetails";
import HRUploadVideo from "./components/HRUploadVideo";
import HRScheduleMeeting from "./components/HRScheduleMeeting";
import VideoCapture from "./components/VideoCapture";

// ✅ Candidate Protected Route
const CandidateProtectedRoute = ({ children }) => {
  const candidateEmail = sessionStorage.getItem("candidateEmail");
  return candidateEmail ? children : <Navigate to="/candidate-login" />;
};

// ✅ HR Protected Route (Same as Before)
const ProtectedRoute = ({ children }) => {
  const hrEmail = localStorage.getItem("hr_email");
  return hrEmail ? children : <Navigate to="/hr-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Candidate Routes (Now Protected) */}
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/candidate-signup" element={<CandidateSignup />} />
        <Route path="/candidate-dashboard" element={<CandidateProtectedRoute><CandidateDashboard /></CandidateProtectedRoute>} />
        <Route path="/candidate-details" element={<CandidateProtectedRoute><CandidateDetails /></CandidateProtectedRoute>} />

        {/* ✅ HR Routes (Protected) */}
        <Route path="/hr-login" element={<HRLogin />} />
        <Route path="/hr-dashboard" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
        <Route path="/hr/candidate/:candidateId" element={<ProtectedRoute><HRCandidateDetails /></ProtectedRoute>} />
        <Route path="/hr/upload-video/:candidateId" element={<ProtectedRoute><HRUploadVideo /></ProtectedRoute>} />
        <Route path="/hr/schedule-meeting/:candidateId" element={<ProtectedRoute><HRScheduleMeeting /></ProtectedRoute>} />

        {/* ✅ Default Route → Redirects to the appropriate login page */}
        <Route path="*" element={
          sessionStorage.getItem("candidateEmail") ? <Navigate to="/candidate-dashboard" /> :
          localStorage.getItem("hr_email") ? <Navigate to="/hr-dashboard" /> :
          <Navigate to="/candidate-login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
