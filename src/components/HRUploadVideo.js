import React, { useState } from "react";

const API_BASE_URL = "http://141.148.219.190:8000";
// ✅ PAR URL Constants
const OCI_PAR_TOKEN = "YOUR_OCI_PAR_TOKEN";
const OCI_NAMESPACE = "YOUR_OCI_NAMESPACE";
const OCI_BUCKET_NAME = "YOUR_OCI_BUCKET_NAME";
const BASE_PAR_URL = `https://${OCI_NAMESPACE}.objectstorage.ap-mumbai-1.oci.customer-oci.com/p/${OCI_PAR_TOKEN}/n/${OCI_NAMESPACE}/b/${OCI_BUCKET_NAME}/o/`;
const OCI_PAR_URL = BASE_PAR_URL + "video/";

const HRUploadVideo = ({ candidateId, onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // ✅ Validate File Type
    const allowedTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file format. Please upload a video file (MP4, AVI, MKV, MOV, WebM).");
      return;
    }

    // ✅ Validate File Size (Max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit.");
      return;
    }

    setVideoFile(file);
    setError(null);
  };

  // ✅ Handle File Upload to OCI Object Storage
  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const videoFilename = `candidate_${candidateId}.mp4`; // ✅ Unique name per candidate
      const uploadUrl = `${OCI_PAR_URL}${videoFilename}`;

      // ✅ Uploading to OCI Object Storage
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: videoFile,
        headers: { "Content-Type": "application/octet-stream" },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      console.log("✅ Video uploaded successfully:", uploadUrl);

      // ✅ Trigger Face Recognition
      await triggerFaceRecognition(videoFilename);

      alert("Video uploaded and verification started!");
      onClose(); // ✅ Close modal after upload
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Trigger Facial Recognition via API
  const triggerFaceRecognition = async (videoFilename) => {
    try {
      const recognitionResponse = await fetch(`${API_BASE_URL}/api/verification/face-recognition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidateId, video_filename: videoFilename }),
      });

      if (!recognitionResponse.ok) {
        throw new Error("Facial recognition failed.");
      }

      console.log("✅ Facial recognition triggered successfully!");
    } catch (err) {
      console.error("❌ Facial recognition error:", err);
      setError("Facial recognition process failed.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg relative">
        {/* ✅ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Upload Candidate Verification Video
        </h2>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <input type="file" accept="video/*" onChange={handleFileChange} className="border p-2 w-full rounded mt-2" />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition-all"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </div>
  );
};

export default HRUploadVideo;
