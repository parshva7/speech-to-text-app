import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get session info on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for auth state changes to update on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  // Logout function that clears Supabase session and user info
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("un"); // Remove if you use it elsewhere
    setUser(null);
    window.location.href = "/"; // Optionally force reload
  };

  return (
    <div className="nav">
      {!user && <Link to="/">Login</Link>}
      {!user && <Link to="/signup">SignUp</Link>}
      {!user && <Link to="/fp">ForgotPassword</Link>}

      {user && <Link to="/">UploadAudio</Link>}
      {user && <Link to="/history">Transcriptions History</Link>}
      {user && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
}

export default Navbar;
