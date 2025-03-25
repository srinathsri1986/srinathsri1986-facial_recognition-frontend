import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CandidateDetails from "./CandidateDetails";

const CandidateDashboard = () => {
    const [candidate, setCandidate] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const email = sessionStorage.getItem("candidateEmail");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!email) {
            navigate("/candidate-login");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `http://141.148.219.190:8000/api/candidate/${encodeURIComponent(email)}?nocache=${Date.now()}`;
                console.log("Fetching data from:", apiUrl);

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    const errorText = await response.text();
                    setError(`Failed to fetch candidate data: ${response.status} - ${errorText}`);
                    throw new Error(`HTTP ${response.status} - API request failed`);
                }

                const data = await response.json();
                setCandidate(data.data);
            } catch (err) {
                if (!error) {
                    setError("Network error or failed to fetch data.");
                }
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [email, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("candidateEmail");
        sessionStorage.removeItem("candidateCompletedDetails");
        navigate("/candidate-login");
    };

    if (loading) {
        return <div className="text-center mt-10 text-xl font-bold">Loading Candidate Details...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    if (!candidate) {
        return <div className="text-center mt-10 text-xl font-bold">Candidate data not available.</div>;
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
            <div className="flex justify-between w-full mb-6 px-6">
                <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleLogout}
                >
                    Sign Out
                </button>
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg w-3/4">
                <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
                <p><strong>Name:</strong> {candidate.first_name} {candidate.last_name}</p>
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Phone:</strong> {candidate.phone}</p>
                <p><strong>Address:</strong> {candidate.address}</p>

                {candidate.id_proof && (
                    <p>
                        <strong>ID Proof:</strong>{" "}
                        <a href={candidate.id_proof} target="_blank" rel="noopener noreferrer">
                            View
                        </a>
                    </p>
                )}

                {candidate.resume && (
                    <p>
                        <strong>Resume:</strong>{" "}
                        <a href={candidate.resume} target="_blank" rel="noopener noreferrer">
                            View
                        </a>
                    </p>
                )}

                {candidate.photo && (
                    <p>
                        <strong>Photo:</strong>{" "}
                        <img
                            src={candidate.photo}
                            alt="Candidate Photo"
                            className="max-w-full h-auto"
                        />
                    </p>
                )}

                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleEditClick}
                >
                    Edit Details
                </button>
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg w-3/4 mt-6">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Interviews</h2>
                {interviews.length > 0 ? (
                    <ul>
                        {interviews.map((interview, index) => (
                            <li key={index} className="border p-3 mb-2">
                                <strong>Company:</strong> {interview.company} <br />
                                <strong>Date:</strong> {interview.date} <br />
                                <strong>Time:</strong> {interview.time} <br />
                                {interview.meeting_link && (
                                    <a
                                        href={interview.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600"
                                    >
                                        Join Zoom Meeting
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No upcoming interviews.</p>
                )}
            </div>

            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-lg relative">
                        <button
                            onClick={handleCloseEdit}
                            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-lg font-bold"
                        >
                            ✕
                        </button>

                        <CandidateDetails onDetailsUpdated={handleCloseEdit} onClose={handleCloseEdit} />

                        <button
                            onClick={handleCloseEdit}
                            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full"
                        >
                            Close Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
