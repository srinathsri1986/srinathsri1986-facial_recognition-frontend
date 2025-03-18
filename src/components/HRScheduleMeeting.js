import React, { useState } from "react";
import { motion } from "framer-motion";
import "./HRScheduleMeeting.css";

const API_BASE_URL = "http://141.148.219.190:8000"; 

const HRScheduleMeeting = ({ candidate, candidateId, onClose }) => {
  const [dateTime, setDateTime] = useState("");
  const hrEmail = sessionStorage.getItem("hrEmail") || localStorage.getItem("hr_email");

  // ✅ Ensure candidate ID is correctly set
  const actualCandidateId = candidate?.id || candidateId;
  if (!actualCandidateId) {
    console.error("❌ Candidate ID is missing.");
    alert("Candidate ID is missing. Please try again.");
    return null;
  }

  const handleSubmit = async () => {
    if (!candidate.email) {
      alert("❌ Candidate email is missing!");
      return;
    }
    if (!hrEmail) {
      alert("❌ HR email not found. Please log in again.");
      return;
    }
    if (!dateTime) {
      alert("❌ Please select a valid date and time.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("candidate_id", actualCandidateId);
    formData.append("candidate_email", candidate.email);
    formData.append("interviewer_email", hrEmail);
    formData.append("start_time", new Date(dateTime).toISOString());

    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/meetings/schedule/`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (data.success) {
        alert(`🎉 Meeting Scheduled Successfully!\nMeeting Link: ${data.meeting_link}`);
        setDateTime("");  // ✅ Clear input field
        onClose();  // ✅ Close the modal only on success
      } else {
        alert(`⚠️ Failed to schedule meeting: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("❌ Error scheduling meeting:", error);
      alert("An error occurred while scheduling the meeting.");
    }
  };

  return (
    <motion.div
      className="schedule-tray"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <h2>Schedule Meeting</h2>
      <p><strong>Candidate:</strong> {candidate.first_name} {candidate.last_name}</p>
      <p><strong>Email:</strong> {candidate.email}</p>
      <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
      <button onClick={handleSubmit}>✅ Schedule</button>
      <button onClick={onClose} className="close-btn">❌ Close</button>
    </motion.div>
  );
};

// ✅ Ensure this is at the very bottom
export default HRScheduleMeeting;
