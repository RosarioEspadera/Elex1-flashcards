const fs = require('fs');
const path = require('path');

const ignoredDirs = ['node_modules', '.git', 'dist'];
const walk = (dir, fileList = []) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoredDirs.includes(file)) {
        walk(fullPath, fileList);
      }
    } else {
      const relPath = path.relative('.', fullPath).replace(/\\/g, '/');
      fileList.push(relPath);
    }
  });
  return fileList;
};

console.log('🔍 Scanning files...');
const files = walk('./');
const filtered = files
  .filter(f => /\.(html|js|css|pdf|json|png|jpg|jpeg|svg|ttf|mjs|ico|ftl|icc|bcmap|pfb)$/i.test(f))
  .sort();

fs.writeFileSync('cache-list.json', JSON.stringify(filtered, null, 2));
console.log(`✅ cache-list.json generated with ${filtered.length} files`);
