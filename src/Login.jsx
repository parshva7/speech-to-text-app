import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });
    if (error) {
      setError(error.message);
    } else if (data.user) {
      localStorage.setItem("un", email);
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="split-container">
              <div className="login-half">

   
    <div className="login-container">
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required /><br />
      <input type="password" placeholder="Password" value={pw}
        onChange={(e) => setPw(e.target.value)} required /><br />
      <button type="submit">Login</button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </form>
    </div>
    </div>
    <div className="welcome-half">
        <div className="welcome-msg">
          Welcome Back
        </div>
      </div>
    </div>
  );
}
export default Login;
