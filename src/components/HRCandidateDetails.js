import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HRScheduleMeeting from "./HRScheduleMeeting";
import HRUploadVideo from "./HRUploadVideo"; // ✅ Import Video Upload Component
import "./HRCandidateDetails.css";

const API_BASE_URL = "http://141.148.219.190:8000"; // ✅ Ensure API URL is correct

const HRCandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showUploadVideo, setShowUploadVideo] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/candidate/${candidateId}`);
        if (!response.ok) throw new Error("Candidate not found");
        const data = await response.json();
        setCandidate(data.data);
      } catch (error) {
        console.error("❌ Error fetching candidate details:", error);
      }
    };

    const fetchMeetings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/meetings`);
        if (!response.ok) throw new Error("Meetings not found");
        const data = await response.json();

        // ✅ Filter meetings for the selected candidate
        const filteredMeetings = data.data?.filter(meeting => meeting.candidate_id === parseInt(candidateId)) || [];
        setMeetings(filteredMeetings);
      } catch (error) {
        console.error("❌ Error fetching meetings:", error);
      }
    };

    fetchCandidate();
    fetchMeetings();
  }, [candidateId]);

  // ✅ Open the document in a new tab for viewing
  const handleFileDownload = (fileUrl) => {
  if (fileUrl) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", ""); // ✅ Forces download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("File not found or invalid.");
  }
};

  return (
    <div className="dashboard-container">
      {/* Sidebar for Meetings */}
      <aside className="sidebar">
        <h3>📅 Candidate's Meetings</h3>
        {meetings.length > 0 ? (
          <ul>
            {meetings.map((meeting, index) => (
              <li key={index} className="meeting-item">
                <p><strong>{candidate?.first_name} {candidate?.last_name}</strong></p>
                <p>🕒 {new Date(meeting.scheduled_at).toLocaleString()}</p>
                <a href={meeting.join_url} target="_blank" rel="noopener noreferrer" className="join-meeting">
                  🔗 Join Meeting
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming meetings.</p>
        )}
      </aside>

      {/* Candidate Details */}
      <div className="content">
        <h2>Candidate Details</h2>
        {candidate ? (
          <div className="candidate-details">
            {/* Profile Section */}
            <div className="profile-section">
              {candidate.photo ? (
                <img 
                  src={candidate.photo}  // ✅ Directly using API URL
                  alt="Candidate" 
                  className="candidate-photo"
                  onError={(e) => {
                    console.error("❌ Image Load Failed:", e.target.src); // 🔥 Debugging Log
                    e.target.src = "/default-profile.png"; // ✅ Fallback Image
                  }}
                />
              ) : (
                <p className="text-gray-600">No photo available.</p>
              )}
              <h3>{candidate.first_name} {candidate.last_name}</h3>
              <p>Email: <a href={`mailto:${candidate.email}`}>{candidate.email}</a></p>
              <p>Verified: {candidate.verified ? "✅ Yes" : "❌ No"}</p>
            </div>

            {/* Documents Section */}
            <div className="documents-section">
              <h3>📁 Documents</h3>
              {candidate.id_proof && (
                <a href={candidate.id_proof} target="_blank" rel="noopener noreferrer">
                  🆔 View ID Proof
                </a>
              )}

              {candidate.resume && (
                <p>
                  <button className="resume-button" onClick={() => handleFileDownload(candidate.resume)}>
                    📄 Download Resume
                  </button>
                </p>
              )}
            </div>

            {/* ✅ Upload Video Button */}
            <button className="upload-video-btn" onClick={() => setShowUploadVideo(true)}>
              📹 Upload Verification Video
            </button>
            {showUploadVideo && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setShowUploadVideo(false)}>❌</span>
                  <HRUploadVideo candidateId={candidateId} onClose={() => setShowUploadVideo(false)} />
                </div>
              </div>
            )}

            {/* Schedule Meeting */}
            <button className="schedule-meeting-btn" onClick={() => setShowSchedule(true)}>
              📅 Schedule Meeting
            </button>
            {showSchedule && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setShowSchedule(false)}>❌</span>
                  <HRScheduleMeeting candidate={candidate} onClose={() => setShowSchedule(false)} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading candidate details...</p>
        )}
      </div>
    </div>
  );
};

export default HRCandidateDetails;
