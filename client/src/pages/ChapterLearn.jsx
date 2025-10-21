// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import { useParams, Link } from "react-router-dom";

// export default function ChapterLearn(){
//   const { slug } = useParams(); const [ch,setCh]=useState(null);
//   useEffect(()=>{ api.get(`/chapters/${slug}`).then(r=>setCh(r.data)); },[slug]);
//   if(!ch) return null;
//   return <div className="wrap">
//     <h2>{ch.title}</h2>
//     {ch.videoUrl ? <video src={ch.videoUrl} controls style={{maxWidth:"100%"}}/> : <div className="placeholder">Animated lecture coming soon</div>}
//     <div dangerouslySetInnerHTML={{__html: ch.notesHtml}} />
//     <Link to={`/chapters/${slug}/quiz`} className="btn">Start Quiz</Link>
//   </div>;
// }



import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useParams } from "react-router-dom";

// very tiny renderer for the example "blocks"
function BlockRenderer({ blocks=[] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        if (b.kind === "heading") return <h3 key={i} style={{margin:"8px 0"}}>{b.text}</h3>;
        if (b.kind === "paragraph") return <p key={i} style={{lineHeight:1.6}}>{b.text}</p>;
        if (b.kind === "bullet_list") return (
          <ul key={i} style={{marginLeft:18}}>
            {b.items.map((it, j)=><li key={j}>{it}</li>)}
          </ul>
        );
        return <pre key={i}>{JSON.stringify(b)}</pre>;
      })}
    </div>
  );
}

export default function ChapterLearn(){
  const { slug } = useParams();
  const [overview,setOverview]=useState(null);
  const [page,setPage]=useState(null);
  const [idx,setIdx]=useState(0);

  // load overview
  useEffect(()=>{ api.get(`/chapters/${slug}/overview`).then(r=>{
    setOverview(r.data);
    setIdx(Math.min(r.data?.progress?.readCount || 0, (r.data?.totalPages||1)-1)); // resume
  }); },[slug]);

  // load page when idx changes
  useEffect(()=>{
    if (overview && typeof idx === "number") {
      api.get(`/chapters/${slug}/page/${idx}`).then(r=>setPage(r.data));
      // mark read in background
      api.post("/progress/page-read", { chapterId: overview._id, pageIdx: idx })
        .then(res=>{
          setOverview(o=>o?({...o, progress: res.data}):o);
        })
        .catch(()=>{});
    }
  },[overview, idx, slug]);

  if(!overview || page===null) return null;

  const total = overview.totalPages || 0;
  const canPrev = idx>0;
  const canNext = idx < total-1;

  return (
    <div className="wrap">
      <h2>{overview.title}</h2>
      <div className="tile">
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{flex:1, background:"#1a1c20", borderRadius:8, height:10}}>
            <div style={{width:`${overview.progress.percent||0}%`, height:"100%", background:"#00aeef", borderRadius:8}} />
          </div>
          <span>{overview.progress.percent || 0}%</span>
        </div>
      </div>

      <div className="qcard" style={{marginTop:12}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
          <b>Page {idx+1} / {total}</b>
          <small>{page.title}</small>
        </div>
        <BlockRenderer blocks={page?.content?.blocks}/>
        <div className="row">
          <button className="btn" disabled={!canPrev} onClick={()=>setIdx(p=>p-1)}>Prev</button>
          <button className="btn primary" disabled={!canNext} onClick={()=>setIdx(p=>p+1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
