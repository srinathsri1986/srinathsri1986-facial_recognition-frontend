import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HRDashboard.css";

const API_BASE_URL = "http://141.148.219.190:8000";

const HRDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Check Authentication Before Accessing Dashboard
  useEffect(() => {
    const hrEmail = localStorage.getItem("hr_email");
    if (!hrEmail) {
      navigate("/hr-login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // ✅ Fetch Candidates (with Match Data) & Meetings
  const fetchData = async () => {
    try {
      const [candidatesRes, meetingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/hr/candidates/match-status`),
        fetch(`${API_BASE_URL}/api/hr/meetings`),
      ]);

      if (!candidatesRes.ok || !meetingsRes.ok) {
        throw new Error(`Server Error: ${candidatesRes.statusText} & ${meetingsRes.statusText}`);
      }

      const candidatesData = await candidatesRes.json();
      const meetingsData = await meetingsRes.json();

      // ✅ Get Current Date & Time
      const now = new Date();

      // ✅ Filter Only Future Meetings
      const upcomingMeetings = (meetingsData.data || [])
        .filter((meeting) => new Date(meeting.scheduled_at) >= now)
        .map((meeting) => ({
          ...meeting,
          candidate_name: candidatesData.data.find((c) => c.id === meeting.candidate_id)?.first_name || "Unknown Candidate",
        }));

      setCandidates(candidatesData.data || []);
      setMeetings(upcomingMeetings);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Format Date for Meetings
  const formatMeetingTime = (dateString) => {
    if (!dateString) return "Unknown Time";

    try {
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate)) return "Invalid Date";

      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(parsedDate);
    } catch (error) {
      console.error("❌ Date Formatting Error:", error);
      return "Invalid Date";
    }
  };

  // ✅ Loading State
  if (loading) return <p>Loading HR Dashboard...</p>;

  // ✅ Error State
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>📅 Upcoming Meetings</h3>
        {meetings.length > 0 ? (
          <ul>
            {meetings.map((meeting, index) => (
              <li key={index} className="meeting-item">
                <p>
                  <strong>{meeting.candidate_name || "Unknown Candidate"}</strong>
                </p>
                <p>🕒 {formatMeetingTime(meeting.scheduled_at)}</p>

                {/* ✅ Join Meeting */}
                <a
                  href={meeting.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="join-meeting"
                  style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                >
                  🔗 Join Meeting
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming meetings.</p>
        )}
      </aside>

      <div className="content">
        <h2>HR Dashboard</h2>
        {candidates.length > 0 ? (
          <table className="candidate-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Face Matched</th>
                <th>Confidence Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>
                    <button
                      className="candidate-link"
                      onClick={() => window.open(`/hr/candidate/${candidate.id}`, "_blank")}
                    >
                      {candidate.first_name} {candidate.last_name}
                    </button>
                  </td>
                  <td>{candidate.email}</td>

                  {/* ✅ HR Verification Status */}
                  <td className={candidate.verified ? "verified" : "unverified"}>
                    {candidate.verified ? "✅ Verified" : "❌ Not Verified"}
                  </td>

                  {/* ✅ Face Match Status */}
                  <td className={candidate.match_found ? "matched" : "not-matched"}>
                    {candidate.match_found ? "✅ Matched" : "❌ Not Matched"}
                  </td>

                  {/* ✅ Confidence Score */}
                  <td>
                    {candidate.confidence_score !== undefined &&
                    candidate.confidence_score !== null
                      ? candidate.confidence_score.toFixed(2)
                      : "0.00"}
                  </td>

                  {/* ✅ Action Buttons */}
                  <td>
                    {candidate.photo ? (
                      <a href={candidate.photo} target="_blank" rel="noopener noreferrer">
                        📷 View Photo
                      </a>
                    ) : (
                      <span className="disabled">📷 No Photo</span>
                    )}

                    {candidate.resume ? (
                      <a href={candidate.resume} target="_blank" rel="noopener noreferrer">
                        📄 View Resume
                      </a>
                    ) : (
                      <span className="disabled">📄 No Resume</span>
                    )}

                    {candidate.id_proof ? (
                      <a href={candidate.id_proof} target="_blank" rel="noopener noreferrer">
                        🆔 View ID Proof
                      </a>
                    ) : (
                      <span className="disabled">🆔 No ID Proof</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No candidates available.</p>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
