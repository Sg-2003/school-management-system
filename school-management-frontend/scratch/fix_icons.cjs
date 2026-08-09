const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            replaceInDir(filePath);
        } else if (filePath.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let original = content;
            content = content.replace(/CheckCircle2/g, 'CircleCheck');
            content = content.replace(/CheckCircle/g, 'CircleCheck');
            content = content.replace(/XCircle/g, 'CircleX');
            if (content !== original) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated: ${filePath}`);
            }
        }
    });
}

replaceInDir('./src');
