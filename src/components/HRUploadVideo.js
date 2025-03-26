import React, { useState } from "react";

const API_BASE_URL = "http://141.148.219.190:8000";
const OCI_PAR_TOKEN = "KlvNhT0KOfX5pjeFJaSs5VPTdiEjcCmjAdZ93FopD-8ZEM5LZivVaGEWI6N9i7o9";
const OCI_NAMESPACE = "bm5jx0spql58";
const OCI_BUCKET_NAME = "facerec-uploads";
const BASE_PAR_URL = `https://${OCI_NAMESPACE}.objectstorage.ap-mumbai-1.oci.customer-oci.com/p/${OCI_PAR_TOKEN}/n/${OCI_NAMESPACE}/b/${OCI_BUCKET_NAME}/o/`;
const OCI_PAR_URL = BASE_PAR_URL + "video/";

const HRUploadVideo = ({ candidateId, onClose, candidatePhoto }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file format. Please upload a valid video file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit.");
      return;
    }

    setVideoFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    setUploading(true);
    setError(null);

    const videoFilename = `candidate_${candidateId}.mp4`;
    const uploadUrl = `${OCI_PAR_URL}${videoFilename}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: videoFile,
        headers: { "Content-Type": "application/octet-stream" },
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

      console.log("✅ Video uploaded:", uploadUrl);
      alert("Video uploaded. Facial recognition will now begin.");

      await triggerFaceRecognition(videoFilename);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Video upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFaceRecognition = async (videoFilename) => {
    setMatching(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("candidate_id", candidateId);
      formData.append("photo_path", candidatePhoto);
      formData.append("video_path", `${BASE_PAR_URL}video/${videoFilename}`);

      const response = await fetch(`${API_BASE_URL}/match/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Facial recognition failed.");

      const data = await response.json();
      console.log("✅ Recognition result:", data);

      setMatchResult(data.result);
      setConfidenceScore(data.result.confidence_score);
    } catch (err) {
      console.error("❌ Recognition error:", err);
      setError("Facial recognition process failed.");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg relative">

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Upload Candidate Verification Video
        </h2>

        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <input type="file" accept="video/*" onChange={handleFileChange} className="border p-2 w-full rounded mt-2" />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition-all"
        >
          {uploading ? "Uploading..." : "Upload & Match Face"}
        </button>

        {/* 🔄 Matching Animation */}
        {matching && (
          <div className="mt-4 p-4 bg-white border rounded text-center animate-pulse shadow">
            <p className="text-lg font-semibold">🔍 Matching Face...</p>
            <p className="text-gray-500 text-sm">This may take a few seconds.</p>
          </div>
        )}

        {/* 🎯 Confidence Score Box */}
        {confidenceScore !== null && (
          <div
            className={`mt-4 p-4 rounded-xl text-white font-bold text-center shadow-md transition-all 
            ${confidenceScore >= 0.8
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : confidenceScore >= 0.5
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                  : "bg-gradient-to-r from-red-400 to-red-600"
              }`}
          >
            🎯 Confidence Score: {Math.round(confidenceScore * 100)}%
          </div>
        )}

        {/* 📝 Match Result Details */}
        {matchResult && (
          <div className="mt-4 bg-white p-4 rounded border shadow text-sm">
            <p>🔗 Matched: {matchResult.match_found ? "✅ Yes" : "❌ No"}</p>
            <p>📅 Time: {new Date().toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRUploadVideo;
