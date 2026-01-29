const fs = require('fs');

const files = [
    'assets/specs/website_collections/web-abdm-endpoints.json',
    'assets/specs/phr_collections/phr-abdm-endpoints.json'
];

files.forEach(f => {
    try {
        const c = JSON.parse(fs.readFileSync(f));
        console.log(`\nFile: ${f}`);
        if (c.item) {
            c.item.forEach(i => console.log(`- ${i.name} (Has items: ${!!i.item})`));
        }
    } catch (e) { console.error(e); }
});
