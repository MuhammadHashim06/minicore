import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css"

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState("");
  const nav=useNavigate(); const { setUser } = useAuth();
  const submit=async(e)=>{ e.preventDefault();
    try{ const r=await api.post("/auth/login",{email,password}); setUser(r.data); nav("/"); }
    catch(e){ setErr(e?.response?.data?.error||"Failed"); }
  };
  return(
  <div className="auth" style={{display:"grid",placeItems:"center", height:"100%",padding:"5%"}}> <div className="card">
    <h2>Welcome back</h2>
    <form onSubmit={submit}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      {err && <p className="err">{err}</p>}
      <button className="btn">Login</button>
    </form>
    <p>No account? <Link to="/register">Register</Link></p>
  </div>
  </div>
  )
}
