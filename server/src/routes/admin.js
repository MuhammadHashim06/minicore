// const { Router } = require("express");
// const { createSubject, updateSubject, deleteSubject, 
//         createChapter, updateChapter, deleteChapter,
//         createPage, updatePage, deletePage, 
//         createQuestion, updateQuestion, deleteQuestion } = require("../controllers/admin");
// const { auth } = require("../middleware/auth");

// const r = Router();
// const guard = auth(process.env.JWT_SECRET, process.env.COOKIE_NAME);

// // Subject Routes
// r.post("/subjects", guard, createSubject);        // Admin can create subject
// r.put("/subjects/:id", guard, updateSubject);    // Admin can update subject
// r.delete("/subjects/:id", guard, deleteSubject); // Admin can delete subject

// // Chapter Routes
// r.post("/chapters", guard, createChapter);        // Admin can create chapter
// r.put("/chapters/:id", guard, updateChapter);    // Admin can update chapter
// r.delete("/chapters/:id", guard, deleteChapter); // Admin can delete chapter

// // Page Routes
// r.post("/pages", guard, createPage);        // Admin can create page
// r.put("/pages/:id", guard, updatePage);    // Admin can update page
// r.delete("/pages/:id", guard, deletePage); // Admin can delete page

// // Question Routes
// r.post("/questions", guard, createQuestion);        // Admin can create question
// r.put("/questions/:id", guard, updateQuestion);    // Admin can update question
// r.delete("/questions/:id", guard, deleteQuestion); // Admin can delete question

// module.exports = r;




const  Router  = require("express");
const {
  createSubject, updateSubject, deleteSubject, 
  createChapter, updateChapter, deleteChapter,
  createPage, updatePage, deletePage, 
  createQuestion, updateQuestion, deleteQuestion,
  getSubjects, getChapters, getPages, getQuestions  // Import GET routes
} = require("../controllers/admin");
const { auth } = require("../middleware/auth");

const r = Router();
const guard = auth(process.env.JWT_SECRET, process.env.COOKIE_NAME);

// Admin routes protection

// Subject Routes
r.get("/subjects", guard, getSubjects);          // Admin can fetch all subjects
r.post("/subjects", guard, createSubject);        // Admin can create subject
r.put("/subjects/:id", guard, updateSubject);    // Admin can update subject
r.delete("/subjects/:id", guard, deleteSubject); // Admin can delete subject

// Chapter Routes
r.get("/chapters", guard, getChapters);          // Admin can fetch all chapters
r.post("/chapters", guard, createChapter);        // Admin can create chapter
r.put("/chapters/:id", guard, updateChapter);    // Admin can update chapter
r.delete("/chapters/:id", guard, deleteChapter); // Admin can delete chapter

// Page Routes
r.get("/pages", guard, getPages);                // Admin can fetch all pages
r.post("/pages", guard, createPage);              // Admin can create page
r.put("/pages/:id", guard, updatePage);          // Admin can update page
r.delete("/pages/:id", guard, deletePage);       // Admin can delete page

// Question Routes
r.get("/questions", guard, getQuestions);        // Admin can fetch all questions
r.post("/questions", guard, createQuestion);        // Admin can create question
r.put("/questions/:id", guard, updateQuestion);    // Admin can update question
r.delete("/questions/:id", guard, deleteQuestion); // Admin can delete question

module.exports = r;
