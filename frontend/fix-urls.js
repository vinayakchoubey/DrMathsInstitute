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
const API_URL_EXPR = '${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}';

walkDir(srcDir, (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix all the nested/corrupted patterns - match anything that looks like a corrupted URL and replace with the correct simple pattern
    // Pattern to match corrupted API URLs
    const corruptedPattern = /\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| ['`]\$\{process\.env\.NEXT_PUBLIC_API_URL[^`]+\`\}/g;
    content = content.replace(corruptedPattern, '`' + API_URL_EXPR);

    // More patterns
    content = content.replace(/\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}\`\}/g,
        '`' + API_URL_EXPR);

    // Clean up double patterns  
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| `\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}`\}'\}/g,
        API_URL_EXPR);

    // Replace remaining nested patterns
    content = content.replace(/'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| `\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}`\}'/g,
        '"http://127.0.0.1:5000"');

    // Fix patterns ending with wrong quotes
    content = content.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| `\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}`\}([^`]+)"\)/g,
        '`' + API_URL_EXPR + '$1`)');
    content = content.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| `\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/127\.0\.0\.1:5000"\}`\}([^`]+)"/g,
        '`' + API_URL_EXPR + '$1`');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed:', filePath);
        fixedCount++;
    }
});

console.log(`\nTotal files fixed: ${fixedCount}`);
