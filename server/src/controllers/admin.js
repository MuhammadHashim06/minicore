// const Subject = require("../models/Subject");
// const Chapter = require("../models/Chapter");
// const Question = require("../models/Question");
// const Page = require("../models/Page");  // Assuming you might store pages in a separate model if needed.

// async function createSubject(req, res) {
//   const { title, slug, grade } = req.body;
//   try {
//     const subject = await Subject.create({ title, slug, grade });
//     res.json(subject);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// async function updateSubject(req, res) {
//   const { id } = req.params;
//   const { title, slug, grade } = req.body;
//   try {
//     const subject = await Subject.findByIdAndUpdate(id, { title, slug, grade }, { new: true });
//     res.json(subject);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// async function deleteSubject(req, res) {
//   const { id } = req.params;
//   try {
//     await Subject.findByIdAndDelete(id);
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // For Chapters, Pages, and Questions the code will follow a similar structure.
// async function createChapter(req, res) {
//   const { subjectId, title, slug, pages } = req.body;
//   try {
//     const chapter = await Chapter.create({ subjectId, title, slug, pages });
//     res.json(chapter);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// async function updateChapter(req, res) {
//   const { id } = req.params;
//   const { title, slug, pages } = req.body;
//   try {
//     const chapter = await Chapter.findByIdAndUpdate(id, { title, slug, pages }, { new: true });
//     res.json(chapter);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// async function deleteChapter(req, res) {
//   const { id } = req.params;
//   try {
//     await Chapter.findByIdAndDelete(id);
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // Similarly for Pages and Questions (create, update, delete)

// module.exports = {
//   createSubject, updateSubject, deleteSubject,
//   createChapter, updateChapter, deleteChapter,
//   createPage, updatePage, deletePage,
//   createQuestion, updateQuestion, deleteQuestion
// };



const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");
const Page = require("../models/Page");  // Assuming you might store pages in a separate model

// Subject Routes
async function createSubject(req, res) {
  const { title, slug, grade, order } = req.body;
  try {
    const subject = await Subject.create({ title, slug, grade, order });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateSubject(req, res) {
  const { id } = req.params;
  const { title, slug, grade, order } = req.body;
  try {
    const subject = await Subject.findByIdAndUpdate(id, { title, slug, grade, order }, { new: true });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteSubject(req, res) {
  const { id } = req.params;
  try {
    await Subject.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Chapter Routes
async function createChapter(req, res) {
  const { subjectId, title, slug, pages, order, isActive } = req.body;
  try {
    const chapter = await Chapter.create({ subjectId, title, slug, pages, order, isActive });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateChapter(req, res) {
  const { id } = req.params;
  const { title, slug, pages, order, isActive } = req.body;
  try {
    const chapter = await Chapter.findByIdAndUpdate(id, { title, slug, pages, order, isActive }, { new: true });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteChapter(req, res) {
  const { id } = req.params;
  try {
    await Chapter.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Page Routes
async function createPage(req, res) {
  const { chapterId, idx, title, content, estSeconds } = req.body;
  try {
    const page = await Page.create({ chapterId, idx, title, content, estSeconds });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePage(req, res) {
  const { id } = req.params;
  const { title, content, estSeconds } = req.body;
  try {
    const page = await Page.findByIdAndUpdate(id, { title, content, estSeconds }, { new: true });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePage(req, res) {
  const { id } = req.params;
  try {
    await Page.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Question Routes
async function createQuestion(req, res) {
  const { chapterId, stem, options, answerKey, explanation } = req.body;
  try {
    const question = await Question.create({ chapterId, stem, options, answerKey, explanation });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateQuestion(req, res) {
  const { id } = req.params;
  const { stem, options, answerKey, explanation } = req.body;
  try {
    const question = await Question.findByIdAndUpdate(id, { stem, options, answerKey, explanation }, { new: true });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteQuestion(req, res) {
  const { id } = req.params;
  try {
    await Question.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Subject GET (fetch all subjects)
async function getSubjects(req, res) {
  try {
    const subjects = await Subject.find();  // Fetch all subjects
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Chapter GET (fetch all chapters)
async function getChapters(req, res) {
  try {
    const chapters = await Chapter.find();  // Fetch all chapters
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Page GET (fetch all pages)
async function getPages(req, res) {
  try {
    const pages = await Page.find();  // Fetch all pages
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Question GET (fetch all questions)
async function getQuestions(req, res) {
  try {
    const questions = await Question.find();  // Fetch all questions
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createSubject, updateSubject, deleteSubject,
  createChapter, updateChapter, deleteChapter,
  createPage, updatePage, deletePage,
  createQuestion, updateQuestion, deleteQuestion,
  getSubjects, getChapters, getPages, getQuestions  // Export the new GET controllers
};