const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const { connectDB } = require("../config/db");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");

// Load the JSON data (assuming it's in the same directory as the script)
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, "seedData.json"), "utf-8"));

(async function run() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI missing in server/.env");
      process.exit(1);
    }
    await connectDB(uri);

    console.log("🧹 Clearing old data...");
    // Clear all the data from the collections before seeding new data
    await Promise.all([Subject.deleteMany({}), Chapter.deleteMany({}), Question.deleteMany({})]);

    console.log("📚 Inserting subjects...");
    for (const subject of seedData.subjects) {
      // Insert each subject and then insert the associated chapters and questions
      const subDoc = await Subject.create({
        title: subject.title,
        slug: subject.slug,
        grade: subject.grade,
        order: subject.order,
      });

      console.log(`  Inserting chapters for ${subject.title}...`);
      for (const chapter of subject.chapters) {
        const chDoc = await Chapter.create({
          subjectId: subDoc._id,
          title: chapter.title,
          slug: chapter.slug,
          videoUrl: chapter.videoUrl,
          pages: chapter.pages,
          order: chapter.order,
          isActive: chapter.isActive,
        });

        // Insert questions for the chapter
        console.log(`    Inserting questions for ${chapter.title}...`);
        const questionDocs = [];
        for (const question of chapter.questions) {
          questionDocs.push({
            chapterId: chDoc._id,
            stem: question.stem,
            options: question.options,
            answerKey: question.answerKey,
          });
        }
        await Question.insertMany(questionDocs);
      }
    }

    console.log("✅ Seeding complete.");
    process.exit(0);
  } catch (e) {
    console.error("❌ Error seeding data: ", e);
    process.exit(1);
  }
})();
