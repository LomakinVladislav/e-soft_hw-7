const fs = require('fs');
const path = require('path');

const args = {};
process.argv.slice(2).forEach(arg => {
    if (!arg.startsWith('--')) return;
    
    const [key, value] = arg.split('=');
    const flag = key.slice(2);
    args[flag] = value || true;
});

if (!args.file || !args.search) {
    console.log('Usage: node grep-lite.js --file=<path> --search=<string>');
    process.exit(1);
}

const searchString = args.search;
const ignoreCase = args['ignore-case'];
const regex = ignoreCase 
    ? new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') 
    : null;

const filePath = path.resolve(args.file);
if (!fs.existsSync(filePath)) {
    console.error('Error: File not found');
    process.exit(1);
}

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split(/\r?\n/);
    
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        let found = false;
        
        if (ignoreCase) {
            found = regex.test(line);
        } else {
            found = line.includes(searchString);
        }
        
        if (found) {
            console.log(`[Line ${lineNumber}]: ${line}`);
        }
    });
} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}