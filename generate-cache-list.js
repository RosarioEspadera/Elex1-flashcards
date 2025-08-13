const fs = require('fs');
const path = require('path');

const walk = (dir, fileList = []) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath.replace(/\\/g, '/'));
    }
  });
  return fileList;
};

const files = walk('./');
const filtered = files.filter(f =>
  /\.(html|js|css|pdf|json|png|jpg|jpeg|svg|ttf|mjs|ico|ftl|icc|bcmap|pfb)$/i.test(f)
);

fs.writeFileSync('cache-list.json', JSON.stringify(filtered, null, 2));
console.log('✅ cache-list.json generated with', filtered.length, 'files');
