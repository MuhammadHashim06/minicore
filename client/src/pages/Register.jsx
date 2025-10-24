import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [grade,setGrade]=useState("G6");const [name,setName]=useState("");
  const [err,setErr]=useState(""); const nav=useNavigate(); const { setUser } = useAuth();
  const submit=async(e)=>{ e.preventDefault();
    try{ const r=await api.post("/auth/register",{email,password,grade,name}); setUser(r.data); nav("/"); }
    catch(e){ setErr(e?.response?.data?.error||"Failed"); }
  };
  return( <div className="auth" style={{display:"grid",placeItems:"center", height:"100%",padding:"5%"}}> <div className="card">
    <h2>Create account</h2>
    <form onSubmit={submit}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <select value={grade} onChange={e=>setGrade(e.target.value)}>
        {["G1","G2","G3","G4","G5","G6","G7","G8","G9","G10","G11","G12"].map(g=><option key={g}>{g}</option>)}
      </select>
      {err && <p className="err">{err}</p>}
      <button className="btn">Register</button>
    </form>
    <p>Already have an account? <Link to="/login">Login</Link></p>
  </div></div>);
}
