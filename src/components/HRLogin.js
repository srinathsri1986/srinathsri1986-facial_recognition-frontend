import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HRLogin.css"; 

const HRLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); 

    try {
      const response = await fetch("http://141.148.219.190:8000/api/hr/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // ✅ Store HR email in localStorage
      localStorage.setItem("hr_email", data.email);

      // ✅ Redirect to HR Home Screen
      navigate("/hr/home");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>HR Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input-field"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default HRLogin;
