import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateChapter() {
  const [chapter, setChapter] = useState({ title: "", subjectId: "", slug: "" });
  const [subjects, setSubjects] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/subjects").then((res) => setSubjects(res.data)); // Get all subjects
    if (id) {
      // Fetch chapter if we are editing
      api.get(`/admin/chapters/${id}`).then((res) => {
        setChapter(res.data);
        setIsEdit(true);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      api.put(`/admin/chapters/${id}`, chapter).then(() => {
        navigate("/admin");
      });
    } else {
      api.post("/admin/chapters", chapter).then(() => {
        navigate("/admin");
      });
    }
  };

  return (
    <div className="wrap">
      <h2>{isEdit ? "Edit Chapter" : "Create Chapter"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={chapter.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Slug</label>
          <input
            type="text"
            name="slug"
            value={chapter.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Subject</label>
          <select
            name="subjectId"
            value={chapter.subjectId}
            onChange={handleChange}
            required
          >
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{isEdit ? "Update Chapter" : "Create Chapter"}</button>
      </form>
    </div>
  );
}
