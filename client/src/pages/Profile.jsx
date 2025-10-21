import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Profile(){
  const [me,setMe]=useState(null);
  const [subsProg,setSubsProg]=useState([]);

  useEffect(()=>{
    api.get("/auth/me").then(r=>setMe(r.data));
    api.get("/progress/subjects").then(r=>setSubsProg(r.data));
  },[]);

  if(!me) return null;

  const overall = (()=>{
    const tot = subsProg.reduce((s,x)=> s + x.totalPages, 0);
    const read = subsProg.reduce((s,x)=> s + x.readPages, 0);
    const p = tot ? Math.round((read/tot)*100) : 0;
    return { tot, read, p };
  })();

  return (
    <div className="wrap">
      <h2>Profile</h2>
      <div className="grid">
        <div className="tile">
          <h3>{me.email}</h3>
          <p>Grade: <b>{me.grade}</b></p>
          <p>XP: <b>{me.xp}</b> • Level: <b>{me.level}</b></p>
          <p>Badges: {me.badges?.length ? me.badges.join(", ") : "—"}</p>
        </div>
        <div className="tile">
          <h3>Overall Progress</h3>
          <div style={{background:"#1a1c20", borderRadius:8, height:12}}>
            <div style={{width:`${overall.p}%`, height:"100%", background:"#00aeef", borderRadius:8}}/>
          </div>
          <p style={{marginTop:8}}>{overall.read}/{overall.tot} pages • {overall.p}%</p>
        </div>
      </div>

      <h3 style={{marginTop:24}}>By Subject</h3>
      <div className="grid">
        {subsProg.map(s => (
          <div key={s.subjectId} className="tile">
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <b>{s.subjectTitle}</b><span>{s.percent}%</span>
            </div>
            <div style={{background:"#1a1c20", borderRadius:8, height:8, marginTop:8}}>
              <div style={{width:`${s.percent}%`, height:"100%", background:"#66d0ff", borderRadius:8}}/>
            </div>
            <small>{s.readPages}/{s.totalPages} pages read</small>
          </div>
        ))}
      </div>
    </div>
  );
}
