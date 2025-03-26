import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HRScheduleMeeting from "./HRScheduleMeeting";
import HRUploadVideo from "./HRUploadVideo";
import "./HRCandidateDetails.css";

const API_BASE_URL = "http://141.148.219.190:8000";

const HRCandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
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
        const filteredMeetings = data.data?.filter(meeting => meeting.candidate_id === parseInt(candidateId)) || [];
        setMeetings(filteredMeetings);
      } catch (error) {
        console.error("❌ Error fetching meetings:", error);
      }
    };

    const fetchMatchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/verification/match/${candidateId}`);
        if (!response.ok) throw new Error("Match history not found");
        const data = await response.json();
        setMatchHistory(data.matches?.reverse() || []);
      } catch (error) {
        console.error("❌ Error fetching match history:", error);
      }
    };

    fetchCandidate();
    fetchMeetings();
    fetchMatchHistory();
  }, [candidateId]);

  const handleFileDownload = (fileUrl) => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("target", "_blank");

      const fileExtension = fileUrl.split(".").pop().toLowerCase();
      if (fileExtension === "pdf") {
        window.open(fileUrl, "_blank");
      } else {
        link.setAttribute("download", fileUrl.split("/").pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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
                  src={candidate.photo}
                  alt="Candidate" 
                  className="candidate-photo"
                  onError={(e) => {
                    console.error("❌ Image Load Failed:", e.target.src);
                    e.target.src = "/default-profile.png";
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
                    📄 View/Download Resume
                  </button>
                </p>
              )}
            </div>

            {/* Upload Video Button */}
            <button className="upload-video-btn" onClick={() => setShowUploadVideo(true)}>
              📹 Upload Verification Video
            </button>
            {showUploadVideo && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setShowUploadVideo(false)}>❌</span>
                  <HRUploadVideo
                    candidateId={candidateId}
                    onClose={() => setShowUploadVideo(false)}
                    candidatePhoto={candidate?.photo || ""}
                  />
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

            {/* 🎯 Match History */}
            <div className="match-history mt-6">
              <h3 className="text-xl font-semibold mb-3">🧠 Face Match History</h3>
              {matchHistory.length > 0 ? (
                <ul className="match-history-list">
                  {matchHistory.map((match, index) => (
                    <li
                      key={index}
                      className={`match-item border-l-4 p-4 mb-3 rounded shadow-sm
                        ${match.match_found ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
                    >
                      <p className="text-sm">📅 <strong>{new Date(match.created_at).toLocaleString()}</strong></p>
                      <p>🆔 Match ID: {match.id}</p>
                      <p>🎯 Confidence Score: <strong>{(match.confidence_score * 100).toFixed(2)}%</strong></p>
                      <p>🖼️ Matching Frames: {match.matching_frames} / {match.checked_frames}</p>
                      <p>🔗 Match Status: <span className="font-semibold">{match.status}</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No face match history available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading candidate details...</p>
        )}
      </div>
    </div>
  );
};

export default HRCandidateDetails;
