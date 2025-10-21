import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [pages, setPages] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    api.get("/admin/subjects").then(r => setSubjects(r.data));
    api.get("/admin/chapters").then(r => setChapters(r.data));
    api.get("/admin/pages").then(r => setPages(r.data));
    api.get("/admin/questions").then(r => setQuestions(r.data));
  }, []);

  return (
    <div className="wrap">
      <h2>Admin Dashboard</h2>

      {/* Subject management */}
      <h3>Subjects</h3>
      <Link to="/admin/subjects/create">Create New Subject</Link>
      <ul>
        {subjects.map(s => (
          <li key={s._id}>
            {s.title} - {s.grade}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>

      {/* Chapter management */}
      <h3>Chapters</h3>
      <Link to="/admin/chapters/create">Create New Chapter</Link>
      <ul>
        {chapters.map(c => (
          <li key={c._id}>
            {c.title} - {c.subjectId}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>

      {/* Page management */}
      <h3>Pages</h3>
      <Link to="/admin/pages/create">Create New Page</Link>
      <ul>
        {pages.map(p => (
          <li key={p._id}>
            {p.title}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>

      {/* Question management */}
      <h3>Questions</h3>
      <Link to="/admin/questions/create">Create New Question</Link>
      <ul>
        {questions.map(q => (
          <li key={q._id}>
            {q.stem}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
