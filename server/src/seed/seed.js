// // server/src/seed/seed.js
// const path = require("path");
// require("dotenv").config({ path: path.join(__dirname, "../.env") });const { connectDB } = require("../config/db");
// const Subject = require("../models/Subject");
// const Chapter = require("../models/Chapter");
// const Question = require("../models/Question");

// (async function run() {
//   console.log("🌱 Seeding data...", process.env.MONGO_URI);

//   await connectDB("mongodb://127.0.0.1:27017/minicore");
//   await Promise.all([Subject.deleteMany({}), Chapter.deleteMany({}), Question.deleteMany({})]);
//   const grade = "G6";
//   const subjects = [
//     { title: "Math", slug: "math", grade, order: 1 },
//     { title: "Science", slug: "science", grade, order: 2 },
//     { title: "English", slug: "english", grade, order: 3 },
//     { title: "Computer", slug: "computer", grade, order: 4 },
//     { title: "GK", slug: "gk", grade, order: 5 }
//   ];
//   const subDocs = await Subject.insertMany(subjects);
//   for (const s of subDocs) {
//     for (let i = 1; i <= 4; i++) {
//       const ch = await Chapter.create({
//         subjectId: s._id,
//         title: `${s.title} Chapter ${i}`,
//         slug: `${s.slug}-ch-${i}`,
//         videoUrl: "",
//         notesHtml: `<p>Notes for ${s.title} Chapter ${i}</p>`,
//         order: i,
//         isActive: true
//       });
//       const qs = [];
//       for (let j = 1; j <= 8; j++) {
//         qs.push({
//           chapterId: ch._id,
//           stem: `Q${j}: Sample question for ${s.title} Ch ${i}?`,
//           options: [
//             { key: "A", text: "Option A" },
//             { key: "B", text: "Option B" },
//             { key: "C", text: "Option C" },
//             { key: "D", text: "Option D" }
//           ],
//           answerKey: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)]
//         });
//       }
//       await Question.insertMany(qs);
//     }
//   }
//   console.log("✅ Seeded (grade G6).");
//   process.exit(0);
// })();







const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connectDB } = require("../config/db");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");

(async function run() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI missing in server/.env");
      process.exit(1);
    }
    await connectDB(uri);

    console.log("🧹 Clearing old data for G6...");
    await Promise.all([Subject.deleteMany({ grade: "G6" }), Chapter.deleteMany({}), Question.deleteMany({})]);

    const grade = "G6";
    const subjects = [
      { title: "Math", slug: "math", grade, order: 1 },
      { title: "Science", slug: "science", grade, order: 2 },
      { title: "English", slug: "english", grade, order: 3 },
      { title: "Computer", slug: "computer", grade, order: 4 },
      { title: "GK", slug: "gk", grade, order: 5 }
    ];

    console.log("📚 Inserting subjects...");
    const subDocs = await Subject.insertMany(subjects);

    console.log("📖 Creating chapters with JSON pages + sample questions...");
    for (const s of subDocs) {
      for (let i = 1; i <= 5; i++) {
        const pages = Array.from({ length: 5 }).map((_, idx) => ({
          idx,
          title: `Page ${idx+1}`,
          content: {
            type: "doc",
            blocks: [
              { kind: "heading", text: `${s.title} Ch ${i} — Page ${idx+1}` },
              { kind: "paragraph", text: "This is JSON content. Render on client as rich text." },
              { kind: "bullet_list", items: ["Point A", "Point B", "Point C"] }
            ]
          },
          estSeconds: 60
        }));

        const ch = await Chapter.create({
          subjectId: s._id,
          title: `${s.title} Chapter ${i}`,
          slug: `${s.slug}-ch-${i}`,
          videoUrl: "",
          pages,
          order: i,
          isActive: true
        });

        const qs = [];
        for (let j = 1; j <= 8; j++) {
          qs.push({
            chapterId: ch._id,
            stem: `(${s.title} Ch ${i}) Sample question ${j}?`,
            options: [
              { key: "A", text: "Option A" },
              { key: "B", text: "Option B" },
              { key: "C", text: "Option C" },
              { key: "D", text: "Option D" }
            ],
            answerKey: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)]
          });
        }
        await Question.insertMany(qs);
      }
    }

    console.log("✅ Seeded: G6 with 5 subjects × 5 chapters × 5 pages + 8 questions/chapter.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
