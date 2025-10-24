// // import { useEffect, useState } from "react";
// // import { api } from "../lib/api";
// // import { Link, useParams } from "react-router-dom";

// // export default function Chapters(){
// //   const { slug } = useParams(); const [items,setItems]=useState([]);
// //   useEffect(()=>{ api.get(`/subjects/${slug}/chapters`).then(r=>setItems(r.data)); },[slug]);
// //   return <div className="wrap">
// //     <h2>Chapters</h2>
// //     <ul className="list">
// //       {items.map(c=> <li key={c._id}><Link to={`/chapters/${c.slug}`}>{c.title}</Link> <Link className="btn small" to={`/chapters/${c.slug}/quiz`}>Take Quiz</Link></li>)}
// //     </ul>
// //   </div>;
// // }








// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import { Link, useParams } from "react-router-dom";

// export default function Chapters(){
//   const { slug } = useParams();
//   const [items,setItems]=useState([]);
//   const [progress,setProgress]=useState([]);

//   useEffect(()=>{
//     api.get(`/subjects/${slug}/chapters`).then(r=>setItems(r.data));
//     api.get("/progress/chapters").then(r=>setProgress(r.data));
//   },[slug]);

//   const percentFor = (chapterId) => progress.find(p=>p.chapterId===chapterId)?.percent || 0;

//   return <div className="wrap">
//     <h2>Chapters</h2>
//     <ul className="list">
//       {items.map(c=> (
//         <li key={c._id} style={{marginBottom:12}}>
//           <div style={{display:"flex", alignItems:"center", gap:8}}>
//             <Link to={`/chapters/${c.slug}`}>{c.title}</Link>
//             <Link className="btn small" to={`/chapters/${c.slug}/quiz`}>Take Quiz</Link>
//           </div>
//           <div style={{background:"#1a1c20", borderRadius:8, height:8, marginTop:6}}>
//             <div style={{width:`${percentFor(c._id)}%`, height:"100%", background:"#66d0ff", borderRadius:8}}/>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>;
// }


import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link, useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Chapters() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get(`/subjects/${slug}/chapters`).then((r) => setItems(r.data));
    api.get("/progress/chapters").then((r) => setProgress(r.data));
  }, [slug]);

  const percentFor = (chapterId) => progress.find((p) => p.chapterId === chapterId)?.percent || 0;

  // Data for PieChart (Chapter Progress)
  const pieData = (progress) => [
    { name: "Completed", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  return (
    <div className="wrap">
      <h2>Chapters</h2>
      <ul className="list">
        {items.map((c) => (
          <li key={c._id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link to={`/chapters/${c.slug}`}>{c.title}</Link>
              <Link className="btn small" to={`/chapters/${c.slug}/quiz`}>
                Take Quiz
              </Link>
            </div>

            {/* Chapter Progress Bar */}
            <div style={{ marginTop: 6 }}>
              <div style={{ background: "#1a1c20", borderRadius: 8, height: 8 }}>
                <div
                  style={{
                    width: `${percentFor(c._id)}%`,
                    height: "100%",
                    background: "#66d0ff",
                    borderRadius: 8,
                  }}
                />
              </div>
              <small style={{ display: "block", marginTop: 4 }}>
                {percentFor(c._id)}% Completed
              </small>
            </div>

            {/* Chapter Progress PieChart */}
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={pieData(percentFor(c._id))}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  fill="#66d0ff"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#66d0ff" />
                  <Cell fill="#282c31" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </li>
        ))}
      </ul>
    </div>
  );
}
