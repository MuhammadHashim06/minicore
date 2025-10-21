import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateSubject() {
  const [subject, setSubject] = useState({ title: "", slug: "", grade: "G6" });
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch subject if we are editing
      api.get(`/admin/subjects/${id}`).then((res) => {
        setSubject(res.data);
        setIsEdit(true);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      api.put(`/admin/subjects/${id}`, subject).then(() => {
        navigate("/admin");
      });
    } else {
      api.post("/admin/subjects", subject).then(() => {
        navigate("/admin");
      });
    }
  };

  return (
    <div className="wrap">
      <h2>{isEdit ? "Edit Subject" : "Create Subject"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={subject.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Slug</label>
          <input
            type="text"
            name="slug"
            value={subject.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Grade</label>
          <select
            name="grade"
            value={subject.grade}
            onChange={handleChange}
            required
          >
            <option value="G6">G6</option>
            <option value="G7">G7</option>
            <option value="G8">G8</option>
          </select>
        </div>
        <button type="submit">{isEdit ? "Update Subject" : "Create Subject"}</button>
      </form>
    </div>
  );
}
