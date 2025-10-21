import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateQuestion() {
  const [question, setQuestion] = useState({ stem: "", options: [], answerKey: "" });
  const [isEdit, setIsEdit] = useState(false);
  const { chapterId, questionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (questionId) {
      api.get(`/admin/questions/${questionId}`).then((res) => {
        setQuestion(res.data);
        setIsEdit(true);
      });
    }
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionsChange = (e, idx) => {
    const updatedOptions = [...question.options];
    updatedOptions[idx] = e.target.value;
    setQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      api.put(`/admin/questions/${questionId}`, question).then(() => {
        navigate(`/admin/chapters/${chapterId}`);
      });
    } else {
      api.post(`/admin/questions`, { ...question, chapterId }).then(() => {
        navigate(`/admin/chapters/${chapterId}`);
      });
    }
  };

  return (
    <div className="wrap">
      <h2>{isEdit ? "Edit Question" : "Create Question"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Question Stem</label>
          <input
            type="text"
            name="stem"
            value={question.stem}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Options</label>
          {question.options.map((option, idx) => (
            <input
              key={idx}
              type="text"
              value={option}
              onChange={(e) => handleOptionsChange(e, idx)}
              required
            />
          ))}
          <button type="button" onClick={() => setQuestion((prev) => ({ ...prev, options: [...prev.options, ""] }))}>
            Add Option
          </button>
        </div>
        <div className="field">
          <label>Answer Key (e.g., A, B, C, D)</label>
          <input
            type="text"
            name="answerKey"
            value={question.answerKey}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEdit ? "Update Question" : "Create Question"}</button>
      </form>
    </div>
  );
}
