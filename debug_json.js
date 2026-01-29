const fs = require('fs');

const files = [
    'docs/assets/openapi/phr/temp_phr-backend-endpoints.json',
    'docs/assets/openapi/website/temp_website-backend-endpoints.json'
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        try {
            JSON.parse(content);
            console.log(`PASS: ${file}`);
        } catch (e) {
            console.log(`FAIL: ${file}`);
            console.log(`Error: ${e.message}`);
            // Extract position if available
            const match = e.message.match(/at position (\d+)/);
            if (match) {
                const pos = parseInt(match[1]);
                const start = Math.max(0, pos - 50);
                const end = Math.min(content.length, pos + 50);
                console.log(`Context: ...${content.substring(start, end).replace(/\n/g, '\\n')}...`);
                // Calculate line number
                const line = content.substring(0, pos).split('\n').length;
                console.log(`Line: ${line}`);
            }
        }
    } catch (err) {
        console.log(`Could not read ${file}: ${err.message}`);
    }
    console.log('---');
});
