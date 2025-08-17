const fs = require("fs");
const path = require("path");

const inputDir = process.cwd(); // current working directory
const outputDir = inputDir;

fs.readdir(inputDir, (err, files) => {
  if (err) return console.error("❌ Failed to read directory:", err);

  files.forEach(file => {
    if (file.endsWith(".json")) {
      const topic = path.basename(file, ".json");
      const variableName = `flashcards_${topic.replace(/-/g, "_")}`;
      const jsonPath = path.join(inputDir, file);
      const jsPath = path.join(outputDir, `${topic}.js`);

      fs.readFile(jsonPath, "utf8", (err, data) => {
        if (err) return console.error(`❌ Failed to read ${file}:`, err);

        try {
          const parsed = JSON.parse(data);
          const jsContent = `window.${variableName} = ${JSON.stringify(parsed, null, 2)};\n`;
          fs.writeFile(jsPath, jsContent, "utf8", err => {
            if (err) return console.error(`❌ Failed to write ${jsPath}:`, err);
            console.log(`✅ Converted ${file} → ${topic}.js`);
          });
        } catch (parseErr) {
          console.error(`❌ Invalid JSON in ${file}:`, parseErr);
        }
      });
    }
  });
});