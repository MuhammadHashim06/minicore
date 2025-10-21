import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useParams } from "react-router-dom";

export default function Quiz(){
  const { slug } = useParams();
  const [qs,setQs]=useState([]); const [chapterId,setChapterId]=useState(""); const [i,setI]=useState(0);
  const [answers,setAnswers]=useState({}); const [result,setResult]=useState(null);

  useEffect(()=>{ api.get(`/chapters/${slug}/quiz`).then(r=>{ setQs(r.data.questions); setChapterId(r.data.chapterId); }); },[slug]);
  if(result){ return <div className="card"><h2>Your Score: {result.score}%</h2><p>{result.correctCount}/{result.total} correct</p><p>XP +{result.xpDelta}</p>{result.newBadge?.length? <p>New badges: {result.newBadge.join(", ")}</p>:null}</div>; }
  if(!qs.length) return null;

  const q = qs[i];
  const choose=(k)=> setAnswers(a=>({...a,[q._id]:k}));
  const submit=async()=> {
    const payload = { chapterId, answers: Object.entries(answers).map(([qId,chosen])=>({qId,chosen})) };
    const r = await api.post("/quiz/submit", payload);
    setResult(r.data);
  };

  return <div className="wrap">
    <div className="qcard">
      <div><b>Q{i+1}.</b> {q.stem}</div>
      <div className="opts">
        {q.options.map(o=>(
          <label key={o.key} className={`opt ${answers[q._id]===o.key?"picked":""}`}>
            <input type="radio" name={q._id} checked={answers[q._id]===o.key} onChange={()=>choose(o.key)}/> {o.key}. {o.text}
          </label>
        ))}
      </div>
      <div className="row">
        <button className="btn" disabled={i===0} onClick={()=>setI(i-1)}>Prev</button>
        {i<qs.length-1 ? <button className="btn" onClick={()=>setI(i+1)}>Next</button> : <button className="btn primary" onClick={submit}>Submit</button>}
      </div>
    </div>
  </div>;
}
