import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

export default function CreatePage() {
  const [page, setPage] = useState({ title: "", chapterId: "", content: {} });
  const [chapter, setChapter] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { chapterId, pageId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/admin/chapters/${chapterId}`).then((res) => setChapter(res.data)); // Fetch chapter info
    if (pageId) {
      api.get(`/admin/pages/${pageId}`).then((res) => {
        setPage(res.data);
        setIsEdit(true);
      });
    }
  }, [chapterId, pageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      api.put(`/admin/pages/${pageId}`, page).then(() => {
        navigate(`/admin/chapters/${chapterId}`);
      });
    } else {
      api.post(`/admin/pages`, { ...page, chapterId }).then(() => {
        navigate(`/admin/chapters/${chapterId}`);
      });
    }
  };

  return (
    <div className="wrap">
      <h2>{isEdit ? "Edit Page" : "Create Page"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={page.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Content (JSON)</label>
          <textarea
            name="content"
            value={JSON.stringify(page.content, null, 2)}
            onChange={(e) => setPage((prev) => ({ ...prev, content: JSON.parse(e.target.value) }))}
            required
          />
        </div>
        <button type="submit">{isEdit ? "Update Page" : "Create Page"}</button>
      </form>
    </div>
  );
}
