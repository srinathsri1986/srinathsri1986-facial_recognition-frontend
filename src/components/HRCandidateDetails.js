import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HRScheduleMeeting from "./HRScheduleMeeting";
import HRUploadVideo from "./HRUploadVideo";
import "./HRCandidateDetails.css";
import FaceMatchHistory from "./FaceMatchHistory"; // Import the FaceMatchHistory component

const API_BASE_URL = "http://141.148.219.190:8000";

const HRCandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showUploadVideo, setShowUploadVideo] = useState(false);
  const [hrEmail, setHrEmail] = useState("hr@example.com");

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
        const filteredMeetings = data.data?.filter(
          (meeting) => meeting.candidate_id === parseInt(candidateId)
        ) || [];
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
        const matches = data.matches || [];

        const transformedMatchHistory = matches.map((match) => ({
          id: match.id,
          created_at: match.created_at,
          confidence_score: match.confidence_score,
          matching_frames: match.matching_frames,
          checked_frames: match.checked_frames,
          status: match.status,
          match_found: match.match_found,
          hr_comments: match.hr_comments,
          candidate: {
            id: match.candidate.id,
            first_name: match.candidate.first_name,
            last_name: match.candidate.last_name,
            email: match.candidate.email,
            verified: match.candidate.verified,
            photo: match.candidate.photo,
            resume: match.candidate.resume,
            id_proof: match.candidate.id_proof,
          },
        }));
        setMatchHistory(transformedMatchHistory.reverse());
      } catch (error) {
        console.error("❌ Error fetching match history:", error);
        setMatchHistory([]);
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

      const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
      if (fileExtension === "pdf") {
        window.open(fileUrl, "_blank");
      } else {
        link.setAttribute("download", fileUrl.split("/").pop() || "downloaded_file");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      alert("File not found or invalid.");
    }
  };

  const handleSendMailToHR = (recipientEmail, comment) => {
    console.log(`Sending email to ${recipientEmail} with comment: ${comment}`);
    alert(`Email sent to ${recipientEmail} (simulated):\nComment: ${comment}`);
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
                <p>
                  <strong>{candidate?.first_name} {candidate?.last_name}</strong>
                </p>
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
      <main className="content">
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
                <div className="candidate-photo">No Photo</div>
              )}
              <h3 className="mt-2 text-lg font-semibold">
                {candidate.first_name} {candidate.last_name}
              </h3>
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

            {/* Schedule Meeting Button */}
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

            {/* Match History */}
            <FaceMatchHistory
              matchHistory={matchHistory}
              onSendMail={handleSendMailToHR}
              hrEmail={hrEmail}
            />
          </div>
        ) : (
          <p>Loading candidate details...</p>
        )}
      </main>
    </div>
  );
};

export default HRCandidateDetails;
