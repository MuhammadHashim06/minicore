import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard(){
  const [me, setMe] = useState(null);
  const [today, setToday] = useState({ questionsAnswered: 0, pointsEarned: 0 });
  const [weekly, setWeekly] = useState({ days: {} });
  const [subsProg, setSubsProg] = useState([]);     // [{ subjectSlug, subjectTitle, percent, totalPages, readPages }]
  const [chapProg, setChapProg] = useState([]);     // [{ chapterSlug, chapterTitle, percent }]
  const [recent, setRecent] = useState(null);       // { score, correct, total, ... }

  useEffect(() => {
    // user (for greeting/xp/level)
    api.get("/auth/me").then(r => setMe(r.data)).catch(()=>{});
    // progress widgets
    api.get("/progress/today").then(r => setToday(r.data)).catch(()=>{});
    api.get("/progress/weekly").then(r => setWeekly(r.data)).catch(()=>{});
    api.get("/progress/subjects").then(r => setSubsProg(r.data)).catch(()=>{});
    api.get("/progress/chapters").then(r => setChapProg(r.data)).catch(()=>{});
    api.get("/progress/achievements/recent").then(r => setRecent(r.data?.recent || null)).catch(()=>{});
  }, []);

  // pick a “continue learning” target: chapter with highest % < 100, else first chapter
  const continueChapter = useMemo(() => {
    if (!chapProg?.length) return null;
    const incomplete = chapProg.filter(c => (c.percent || 0) < 100);
    const sorted = (incomplete.length ? incomplete : chapProg).sort((a,b) => (b.percent||0) - (a.percent||0));
    return sorted[0] || null;
  }, [chapProg]);

  // overall subject progress (pages read / total)
  const overall = useMemo(() => {
    const tot = subsProg.reduce((s,x)=> s + (x.totalPages||0), 0);
    const read = subsProg.reduce((s,x)=> s + (x.readPages||0), 0);
    const p = tot ? Math.round((read/tot)*100) : 0;
    return { tot, read, p };
  }, [subsProg]);

  return (
    <div className="wrap">
      <h2>Welcome 👋 {me ? <small style={{opacity:.8, fontWeight:400}}>({me.email})</small> : null}</h2>

      {/* Top summary row */}
      <div className="grid">
        <div className="tile">
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <b>Today</b>
            {me ? <span>XP {me.xp} • Lv {me.level}</span> : null}
          </div>
          <p style={{marginTop:8}}>{today.questionsAnswered} questions • {today.pointsEarned} pts</p>
          {/* overall bar */}
          <div style={{background:"#1a1c20", borderRadius:8, height:10, marginTop:8}}>
            <div style={{width:`${overall.p}%`, height:"100%", background:"#00aeef", borderRadius:8}}/>
          </div>
          <small>{overall.read}/{overall.tot} pages • {overall.p}% overall</small>
        </div>

        <div className="tile">
          <b>Weekly</b>
          <ul style={{marginTop:8}}>
            {Object.entries(weekly.days).map(([d,v])=>(
              <li key={d}>{d}: {v.questionsAnswered}Q, {v.pointsEarned}pts</li>
            ))}
            {Object.keys(weekly.days).length === 0 && <li>No activity yet</li>}
          </ul>
        </div>

        <Link className="tile" to={continueChapter ? `/chapters/${continueChapter.chapterSlug}` : "/subjects"}>
          <b>Continue Learning →</b>
          {continueChapter
            ? <p style={{marginTop:6}}>
                {continueChapter.chapterTitle}<br/>
                <span style={{opacity:.8}}>Progress {continueChapter.percent || 0}%</span>
              </p>
            : <p style={{marginTop:6, opacity:.8}}>Pick a subject to get started</p>}
        </Link>

        <div className="tile">
          <b>Recent Achievement</b>
          {recent
            ? <p style={{marginTop:6}}>
                Last quiz: <b>{recent.score}%</b> ({recent.correct}/{recent.total})<br/>
                {recent.chapterId ? <small style={{opacity:.8}}>chapter #{String(recent.chapterId).slice(-4)}</small> : null}
              </p>
            : <p style={{marginTop:6, opacity:.8}}>No quiz yet — try one today!</p>}
        </div>
      </div>

      {/* Subjects with progress */}
      <h3 style={{marginTop:24}}>Your Subjects</h3>
      <div className="grid">
        {subsProg.map(s => (
          <Link key={s.subjectId} to={`/subjects/${s.subjectSlug}`} className="tile" style={{display:"block"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span>{s.subjectTitle}</span>
              <b>{s.percent}%</b>
            </div>
            <div style={{background:"#1a1c20", borderRadius:8, height:8, marginTop:8}}>
              <div style={{width:`${s.percent}%`, height:"100%", background:"#66d0ff", borderRadius:8}}/>
            </div>
            <small>{s.readPages}/{s.totalPages} pages read</small>
          </Link>
        ))}
        {subsProg.length === 0 && (
          <div className="tile">
            <p style={{margin:0}}>No subjects yet. <Link to="/subjects">Open catalog →</Link></p>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{marginTop:24, display:"flex", gap:12, flexWrap:"wrap"}}>
        <Link className="btn" to="/subjects">Subjects</Link>
        {continueChapter && <Link className="btn primary" to={`/chapters/${continueChapter.chapterSlug}`}>Resume Chapter</Link>}
        <Link className="btn" to="/profile">Profile</Link>
      </div>
    </div>
  );
}
