import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./ForgotPassword.css";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

 const handleReset = async (e) => {
  e.preventDefault();
  setErr("");
  setMsg("");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/resetpassword"
  });
  if (error) setErr(error.message);
  else {
    setMsg("Password reset email sent! Check your inbox.");
    // Force logout here to update Navbar
    await supabase.auth.signOut();
    localStorage.removeItem("un");
  }
};


  return (
       <div className="split-container">
      <div className="forgot-half">
        <div className="forgot-container">
    <form onSubmit={handleReset}>
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Your Email" value={email} onChange={e=>setEmail(e.target.value)} required /><br />
      <button type="submit">Send reset mail</button>
      {err && <p style={{color:"red"}}>{err}</p>}
      {msg && <p style={{color:"green"}}>{msg}</p>}
    </form>
    </div>
    </div>
     <div className="comfort-half">
        <div className="comfort-msg">Don't worry—we'll help you reset it!</div>
      </div>
    </div>
  );
}
export default ForgotPassword;
