import React, { useRef, useState } from "react";
import axios from "axios";

const VideoCapture = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [email, setEmail] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob || !email) {
      alert("Please enter your email and record a video.");
      return;
    }
    const formData = new FormData();
    formData.append("file", videoBlob, "recorded-video.mp4");
    formData.append("email", email);

    try {
      const response = await axios.post(
        "http://141.148.219.190:8000/verify-video/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.verified ? "✅ Verification Successful" : "❌ Verification Failed");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Video Capture</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="p-2 border rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <video ref={videoRef} autoPlay className="mb-4 border rounded" />
      <div className="mb-4">
        {!recording ? (
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>
      {videoBlob && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={uploadVideo}>
          Upload Video
        </button>
      )}
    </div>
  );
};

export default VideoCapture;
