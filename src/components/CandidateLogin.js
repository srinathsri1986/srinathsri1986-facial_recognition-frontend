import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CandidateLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://141.148.219.190:8000/api/candidate/login", {
                mode: "cors",  // ✅ Ensures CORS headers are sent
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error("❌ Backend Error:", data);
                alert(`Login failed: ${data.detail || "Unknown error"}`);
                return;
            }
    
            alert("✅ Login successful!");
    
            // ✅ Store candidate details in sessionStorage
            sessionStorage.setItem("candidateEmail", email);
            sessionStorage.setItem("hasCompletedProfile", data.hasCompletedProfile ? "true" : "false");
    
            // ✅ Navigate based on profile completion status
            navigate(data.hasCompletedProfile ? "/candidate-dashboard" : "/candidate-details");
    
        } catch (error) {
            console.error("❌ Login Error:", error);
            alert("Something went wrong. Check your network connection.");
        }
    };    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Candidate Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 w-full rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 w-full rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition">
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    New user? <a href="/candidate-signup" className="text-blue-600">Signup Here</a>
                </p>
            </div>
        </div>
    );
};

// ✅ Ensure export is at the bottom
export default CandidateLogin;
