import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CandidateLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://141.148.219.190:8000/api/candidate/login", {
                mode: "cors",
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

            sessionStorage.setItem("candidateEmail", email);
            sessionStorage.setItem("hasCompletedProfile", data.hasCompletedProfile ? "true" : "false");

            navigate(data.hasCompletedProfile ? "/candidate-dashboard" : "/candidate-details");

        } catch (error) {
            console.error("❌ Login Error:", error);
            alert("Something went wrong. Check your network connection.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetMessage("");

        try {
            const response = await fetch("http://141.148.219.190:8000/api/candidate/reset-password", {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Reset Password Error:", data);
                setResetMessage(`Password reset failed: ${data.detail || "Unknown error"}`);
                return;
            }

            setResetMessage(data.message || "Password reset successful! Please check your email.");
            setShowResetForm(false);
            setResetEmail("");
        } catch (error) {
            console.error("❌ Reset Password Error:", error);
            setResetMessage("Something went wrong during password reset. Check your network connection.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Candidate Login</h2>
                {showResetForm ? (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="border p-2 w-full rounded"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition">
                            Reset Password
                        </button>
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            onClick={() => {
                                setShowResetForm(false);
                                setResetMessage("");
                            }}
                        >
                            Back to Login
                        </button>
                        {resetMessage && <p className="text-center text-sm">{resetMessage}</p>}
                    </form>
                ) : (
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
                        <p className="text-center mt-4">
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                onClick={() => {
                                    setShowResetForm(true);
                                    setResetMessage("");
                                }}
                            >
                                Forgot Password?
                            </a>
                        </p>
                        <p className="text-center mt-4">
                            New user? <a href="/candidate-signup" className="text-blue-600">Signup Here</a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

// ✅ Ensure export is at the bottom
export default CandidateLogin;
