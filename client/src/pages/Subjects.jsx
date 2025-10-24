// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import { Link } from "react-router-dom";

// export default function Subjects(){
//   const [items,setItems]=useState([]);
//   useEffect(()=>{ api.get("/subjects").then(r=>setItems(r.data)); },[]);
//   return <div className="wrap">
//     <h2>Subjects</h2>
//     <div className="grid">
//       {items.map(s=> <Link key={s._id} to={`/subjects/${s.slug}`} className="tile">{s.title}</Link>)}
//     </div>
//   </div>;
// }






// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import { Link } from "react-router-dom";

// export default function Subjects(){
//   const [items,setItems]=useState([]);
//   const [subsProg,setSubsProg]=useState([]);

//   useEffect(()=>{
//     api.get("/subjects").then(r=>setItems(r.data));
//     api.get("/progress/subjects").then(r=>setSubsProg(r.data));
//   },[]);

//   const pFor = (slug) => subsProg.find(s=>s.subjectSlug===slug)?.percent || 0;

//   return <div className="wrap">
//     <h2>Subjects</h2>
//     <div className="grid">
//       {items.map(s=> (
//         <Link key={s._id} to={`/subjects/${s.slug}`} className="tile" style={{display:"block"}}>
//           <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
//             <span>{s.title}</span>
//             <b>{pFor(s.slug)}%</b>
//           </div>
//           <div style={{background:"#1a1c20", borderRadius:8, height:8, marginTop:8}}>
//             <div style={{width:`${pFor(s.slug)}%`, height:"100%", background:"#00aeef", borderRadius:8}}/>
//           </div>
//         </Link>
//       ))}
//     </div>
//   </div>;
// }


import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Subjects() {
  const [items, setItems] = useState([]);
  const [subsProg, setSubsProg] = useState([]);

  useEffect(() => {
    api.get("/subjects").then((r) => setItems(r.data));
    api.get("/progress/subjects").then((r) => setSubsProg(r.data));
  }, []);

  const pFor = (slug) => subsProg.find((s) => s.subjectSlug === slug)?.percent || 0;

  // Data for PieChart (Subject Progress)
  const pieData = (progress) => [
    { name: "Completed", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  return (
    <div className="wrap">
      <h2>Subjects</h2>
      <div className="grid">
        {items.map((s) => (
          <Link key={s._id} to={`/subjects/${s.slug}`} className="tile" style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{s.title}</span>
              <b>{pFor(s.slug)}%</b>
            </div>

            {/* Progress Bar */}
            <div style={{ background: "#1a1c20", borderRadius: 8, height: 8, marginTop: 8 }}>
              <div
                style={{
                  width: `${pFor(s.slug)}%`,
                  height: "100%",
                  background: "#00aeef",
                  borderRadius: 8,
                }}
              />
            </div>

            {/* PieChart */}
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={pieData(pFor(s.slug))}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  fill="#66d0ff"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#00aeef" />
                  <Cell fill="#282c31" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Link>
        ))}
      </div>
    </div>
  );
}
