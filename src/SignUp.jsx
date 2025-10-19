import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"; // Use your new signup styles

function SignUp() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  const { error } = await supabase.auth.signUp({
    email,
    password: pw,
  });
  if (error) {
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already exists") ||
      error.message.toLowerCase().includes("duplicate") ||
      error.message.toLowerCase().includes("user exists")
    ) {
      setError("Email is already in use. Please use a different email or log in.");
    } else {
      setError(error.message);
    }
  } else {
    alert("Signup successful! Please check your email for confirmation.");
    navigate("/");
  }
};



  return (
    <div className="split-container">
      <div className="signup-half">
        <div className="signup-container">
          <form onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
      <div className="welcome-half">
        <div className="welcome-msg">Create Your Account</div>
      </div>
    </div>
  );
}

export default SignUp;
