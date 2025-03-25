import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CandidateSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 🧹 Clear any existing HR session to avoid conflicts
    localStorage.removeItem("hr_email");

    // ✅ Successful signup (mocked)
    alert("Signup Successful! Redirecting to Login...");
    navigate("/candidate-login"); // ✅ Correct redirect
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-teal-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Candidate Signup</h2>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email:</label>
            <input
              type="email"
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Password:</label>
            <input
              type="password"
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1">Confirm Password:</label>
            <input
              type="password"
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-green-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white w-full py-2 rounded-md font-semibold hover:bg-green-600 transition-all"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateSignup;
