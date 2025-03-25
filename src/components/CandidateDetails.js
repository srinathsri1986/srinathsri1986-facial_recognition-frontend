import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CandidateDetails = ({ onClose = () => {}, onDetailsUpdated = () => {} }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [idProof, setIdProof] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cv, setCV] = useState(null);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const BASE_OCI_URL = "https://objectstorage.ap-mumbai-1.oraclecloud.com";
  const API_BASE_URL = "http://141.148.219.190:8000/api/candidate";

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("candidateEmail");
    if (!storedEmail) {
      navigate("/candidate-login");
      return;
    }
    setEmail(storedEmail);
    fetchCandidateDetails(storedEmail);
  }, [navigate]);

  const fixURL = (filePath) =>
    filePath && filePath.startsWith("http") ? filePath : `${BASE_OCI_URL}${filePath}`;

  const fetchCandidateDetails = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);

      const data = await response.json();
      setFirstName(data.data.first_name || "");
      setLastName(data.data.last_name || "");
      setAddress(data.data.address || "");
      setPhone(data.data.phone || "");
      setPhoto(fixURL(data.data.photo));
      setIdProof(fixURL(data.data.id_proof));
      setCV(fixURL(data.data.resume));
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setError("An error occurred while fetching details. Please try again.");
    }
  };

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !address || !phone || !agree) {
      setError("All fields are required except file uploads.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("address", address);
    formData.append("phone", phone);
    if (idProof && typeof idProof !== "string") formData.append("id_proof", idProof);
    if (photo && typeof photo !== "string") formData.append("photo", photo);
    if (cv && typeof cv !== "string") formData.append("resume", cv);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/update-details`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      };

      xhr.onload = () => {
        setLoading(false);
        if (xhr.status === 200) {
          toast.success("Details submitted successfully!");
          sessionStorage.setItem("hasCompletedProfile", "true");
          onDetailsUpdated();
          onClose();
        } else {
          toast.error("Submission failed. Try again.");
          setError("Something went wrong. Try again.");
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        toast.error("Network error. Try again later.");
        setError("Something went wrong. Try again.");
      };

      xhr.send(formData);
    } catch (err) {
      setLoading(false);
      console.error("Error submitting details:", err);
      setError("Something went wrong. Try again.");
    }
  };

  const profileCompletion = () => {
    let completed = 0;
    if (firstName) completed++;
    if (lastName) completed++;
    if (address) completed++;
    if (phone) completed++;
    if (idProof) completed++;
    if (photo) completed++;
    if (cv) completed++;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-lg font-bold">✕</button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Candidate Details</h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <div className="mb-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${profileCompletion()}%` }}></div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] p-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="border p-2 rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" className="border p-2 rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <input type="text" placeholder="Address" className="border p-2 w-full rounded" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <input type="tel" placeholder="Phone" className="border p-2 w-full rounded" pattern="[0-9]{10}" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <div>
            <label className="font-semibold block">ID Proof:</label>
            {typeof idProof === "string" && <a href={idProof} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View ID Proof</a>}
            <input type="file" className="border p-2 w-full rounded mt-2" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, setIdProof)} />
          </div>

          <div>
            <label className="font-semibold block">Photo:</label>
            {typeof photo === "string" && <img src={photo} alt="Candidate" className="max-w-full h-32 mt-2" />}
            <input type="file" className="border p-2 w-full rounded mt-2" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, setPhoto)} />
          </div>

          <div>
            <label className="font-semibold block">CV (PDF/DOC/DOCX):</label>
            {typeof cv === "string" && <a href={cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Resume</a>}
            <input type="file" className="border p-2 w-full rounded mt-2" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setCV)} />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            <label>I agree to the terms and conditions</label>
          </div>

          {loading && (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-6 h-6 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Uploading... {progress}%</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition-all">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateDetails;
