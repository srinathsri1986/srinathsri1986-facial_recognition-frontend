import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Candidate components
import CandidateLogin from "./components/CandidateLogin";
import CandidateSignup from "./components/CandidateSignup";
import CandidateDashboard from "./components/CandidateDashboard";
import CandidateDetails from "./components/CandidateDetails";

// HR components
import HRLogin from "./components/HRLogin";
import HRDashboard from "./components/HRDashboard";
import HRCandidateDetails from "./components/HRCandidateDetails";
import HRUploadVideo from "./components/HRUploadVideo";
import HRScheduleMeeting from "./components/HRScheduleMeeting";
import HRCandidateAnalyticsDashboard from "./components/HRCandidateAnalyticsDashboard";
import HRHomeScreen from "./components/HRHomeScreen";

import VideoCapture from "./components/VideoCapture";

// ✅ Candidate Protected Route
const CandidateProtectedRoute = ({ children }) => {
  const candidateEmail = sessionStorage.getItem("candidateEmail");
  return candidateEmail ? children : <Navigate to="/candidate-login" />;
};

// ✅ HR Protected Route
const HRProtectedRoute = ({ children }) => {
  const hrEmail = localStorage.getItem("hr_email");
  return hrEmail ? children : <Navigate to="/hr-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Candidate Routes */}
        <Route path="/candidate-signup" element={<CandidateSignup />} />
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route
          path="/candidate-dashboard"
          element={<CandidateProtectedRoute><CandidateDashboard /></CandidateProtectedRoute>}
        />
        <Route
          path="/candidate-details"
          element={<CandidateProtectedRoute><CandidateDetails /></CandidateProtectedRoute>}
        />

        {/* ✅ HR Routes */}
        <Route path="/hr-login" element={<HRLogin />} />
        <Route
          path="/hr/home"
          element={<HRProtectedRoute><HRHomeScreen /></HRProtectedRoute>}
        />
        <Route
          path="/hr-dashboard"
          element={<HRProtectedRoute><HRDashboard /></HRProtectedRoute>}
        />
        <Route
          path="/hr/candidate/:candidateId"
          element={<HRProtectedRoute><HRCandidateDetails /></HRProtectedRoute>}
        />
        <Route
          path="/hr/candidate/:candidateId/analytics"
          element={<HRProtectedRoute><HRCandidateAnalyticsDashboard /></HRProtectedRoute>}
        />
        <Route
          path="/hr/upload-video/:candidateId"
          element={<HRProtectedRoute><HRUploadVideo /></HRProtectedRoute>}
        />
        <Route
          path="/hr/schedule-meeting/:candidateId"
          element={<HRProtectedRoute><HRScheduleMeeting /></HRProtectedRoute>}
        />

        {/* ✅ Fallback Route */}
        <Route path="*" element={<Navigate to="/candidate-login" />} />
      </Routes>

      {/* ✅ Global Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
