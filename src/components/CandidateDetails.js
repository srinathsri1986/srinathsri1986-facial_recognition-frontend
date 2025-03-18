import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    const fixURL = (filePath) => filePath && filePath.startsWith("http") ? filePath : `${BASE_OCI_URL}${filePath}`;

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

    const handleFileChange = (event, setFile) => setFile(event.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !address || !phone || !agree) {
            setError("All fields are required except file uploads.");
            return;
        }
        setError("");

        const updateData = JSON.stringify({ email, first_name: firstName, last_name: lastName, address, phone });
        const formData = new FormData();
        formData.append("update_data", new Blob([updateData], { type: "application/json" }));
        if (idProof && typeof idProof !== "string") formData.append("id_proof", idProof);
        if (photo && typeof photo !== "string") formData.append("photo", photo);
        if (cv && typeof cv !== "string") formData.append("resume", cv);

        try {
            const response = await fetch(`${API_BASE_URL}/update-details`, { method: "POST", body: formData });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
            alert("Details submitted successfully!");
            sessionStorage.setItem("hasCompletedProfile", "true");
            onDetailsUpdated();
            onClose();
        } catch (error) {
            console.error("Error submitting details:", error);
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-lg font-bold">✕</button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Candidate Details</h2>
                {error && <p className="text-red-600 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh] p-2">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" className="border p-2 rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="text" placeholder="Last Name" className="border p-2 rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <input type="text" placeholder="Address" className="border p-2 w-full rounded mt-4" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    <input type="text" placeholder="Phone" className="border p-2 w-full rounded mt-4" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <div className="mt-4">
                        <label className="block font-semibold">ID Proof:</label>
                        {idProof && <a href={idProof} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View ID Proof</a>}
                        <input type="file" className="border p-2 w-full rounded mt-2" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, setIdProof)} />
                    </div>
                    <div className="mt-4">
                        <label className="block font-semibold">Photo:</label>
                        {photo && <img src={photo} alt="Candidate Photo" className="max-w-full h-auto mt-2" />}
                        <input type="file" className="border p-2 w-full rounded mt-2" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, setPhoto)} />
                    </div>
                    <div className="mt-4">
                        <label className="block font-semibold">CV (PDF/DOC/DOCX):</label>
                        {cv && <a href={cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Resume</a>}
                        <input type="file" className="border p-2 w-full rounded mt-2" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setCV)} />
                    </div>
                    <div className="mt-4">
                        <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                        <label className="ml-2">I agree to the terms and conditions</label>
                    </div>
                    <button type="submit" className="mt-6 bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition-all">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CandidateDetails;
