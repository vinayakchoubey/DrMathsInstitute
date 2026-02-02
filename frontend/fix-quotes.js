const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const srcDir = './src';
let fixedCount = 0;

walkDir(srcDir, (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix template literals that end with " instead of `
    // Pattern: `${...}/api/something")  should be  `${...}/api/something`)
    content = content.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}(\/api\/[^"]+)"\)/g,
        '`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}$1`)');

    // Also fix ones ending with ", (with comma after)
    content = content.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}(\/api\/[^"]+)",/g,
        '`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}$1`,');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed:', filePath);
        fixedCount++;
    }
});

console.log(`\nTotal files fixed: ${fixedCount}`);
