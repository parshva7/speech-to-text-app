import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
function ResetPassword() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetPassword = async (e) => {
  e.preventDefault();
  setErr(""); setMsg(""); setLoading(true);

  // Attempt to update password
  const { error } = await supabase.auth.updateUser({ password: pw });

  setLoading(false);
  if (error) {
    setErr(error.message);
  } else {
    setMsg("Password updated! Redirecting to login...");
    // Force logout after successful reset
    await supabase.auth.signOut();
    localStorage.removeItem("un"); // Remove only if used elsewhere
    setTimeout(() => navigate("/"), 1600); // Optionally redirect after short delay
  }
};

return (
  <div className="split-container">
    <div className="reset-half">
      <div className="reset-container">
        <form onSubmit={handleSetPassword}>
          <h2>Set New Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
          {err && <p className="error">{err}</p>}
          {msg && <p className="success">{msg}</p>}
        </form>
      </div>
    </div>
    <div className="comfort-half">
      <div className="comfort-msg">
        Reset your password and get back on track!
      </div>
    </div>
  </div>
);


}
export default ResetPassword;
