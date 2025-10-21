import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Navbar() {
  const { user, setUser } = useAuth();
  return (
    <nav className="nav">
      <Link to="/">MiniCore</Link>
      <div style={{ marginLeft: "auto" }}>
        {user
          ? <>
              <span style={{ marginRight: 12 }}>XP {user.xp} • Lv {user.level}</span>
              <button className="btn" onClick={async()=>{ await api.post("/auth/logout"); setUser(null); }}>Logout</button>
            </>
          : <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
}
