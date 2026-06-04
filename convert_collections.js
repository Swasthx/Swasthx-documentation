const p2o = require('postman-to-openapi');
const fs = require('fs');
const path = require('path');

const phrDir = 'assets/specs/phr_collections';
const webDir = 'assets/specs/website_collections';
const phrOut = 'assets/openapi/phr';
const webOut = 'assets/openapi/website';

function stripComments(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/("(?:\\"|[^"])*")|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g1) => g1 ? g1 : "");
}

function cleanCollection(obj) {
    if (!obj || typeof obj !== 'object') return;

    if (obj.mode === 'raw' && typeof obj.raw === 'string') {
        let shouldClean = false;
        if (obj.options && obj.options.raw && obj.options.raw.language === 'json') {
            shouldClean = true;
        } else {
            const trimmed = obj.raw.trim();
            if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                shouldClean = true;
            }
        }

        if (shouldClean) {
            const cleaned = stripComments(obj.raw);
            try {
                if (!cleaned.trim()) {
                    obj.raw = "{}";
                } else {
                    JSON.parse(cleaned);
                    obj.raw = cleaned;
                }
            } catch (e) {
                obj.raw = "{}";
            }
        }
    }

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cleanCollection(obj[key]);
        }
    }
}

// Function to clean and flatten the collection
// parentName: The name of the folder containing the current 'item'.
// If null, 'item' is a top-level folder.
function flattenAndClean(items, collector, parentName = null) {
    if (!items || !Array.isArray(items)) return;

    items.forEach(item => {
        // Remove description from folders to save space/readability
        if (item.item) {
            delete item.description;
        }

        if (item.item && Array.isArray(item.item)) {
            // It is a folder
            // Check if it has direct requests (not sub-folders)
            const requestChildren = item.item.filter(sub => !sub.item);

            if (requestChildren.length > 0) {
                // This folder contains requests. 
                // Grouping Logic:
                // User wants "Nearest Parent Folder".
                // We use 'parentName' (Parent of the current folder) as the tag if available.
                // This groups siblings together.
                // E.g. 'Auth' -> 'Login', 'Logout'. 
                // Visiting 'Login': parentName='Auth'. Tag='Auth'.
                // Visiting 'Logout': parentName='Auth'. Tag='Auth'.
                // Result: Tag 'Auth' contains both.

                const groupName = parentName || item.name;

                // Check if we already have a group for this name in the collector
                let existingGroup = collector.find(g => g.name === groupName);
                if (existingGroup) {
                    existingGroup.item.push(...requestChildren);
                } else {
                    collector.push({
                        name: groupName,
                        item: requestChildren,
                        auth: item.auth,
                        event: item.event,
                        variable: item.variable
                    });
                }
            }

            // Recursively process sub-folders
            // We pass 'item.name' as the parent for the next level
            const subFolders = item.item.filter(sub => sub.item);
            flattenAndClean(subFolders, collector, item.name);

        } else {
            // Root-level requests handled in processCollection
        }
    });
}

function processCollection(inputContent) {
    // First parse and clean the standard JSON issues (comments etc)
    let tempCollection = JSON.parse(inputContent);
    cleanCollection(tempCollection);

    // Create a new items array for the flattened structure
    let newItems = [];

    // Handle root-level requests separately if any
    if (tempCollection.item && Array.isArray(tempCollection.item)) {
        const rootRequests = tempCollection.item.filter(i => !i.item);
        if (rootRequests.length > 0) {
            newItems.push({
                name: "General", // Default tag for root requests
                item: rootRequests
            });
        }

        // Flatten nested folders
        // Start with null parentName for top-level items
        flattenAndClean(tempCollection.item, newItems, null);
    }

    // Sort items by name for consistent order
    newItems.sort((a, b) => a.name.localeCompare(b.name));

    tempCollection.item = newItems;
    return tempCollection;
}

async function convertDir(src, dst) {
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    try {
        const files = fs.readdirSync(src).filter(f => f.endsWith('.json'));
        console.log(`Found ${files.length} files in ${src}`);
        for (const file of files) {
            const inputPath = path.join(src, file);
            const outputPath = path.join(dst, file.replace('.json', '.yaml'));
            const tempFile = path.join(dst, `temp_${file}`);
            let failed = false;

            console.log(`Converting ${inputPath} to ${outputPath}...`);
            try {
                // 1. Read and Process (Flatten & Clean)
                let content = fs.readFileSync(inputPath, 'utf8');
                let collection = processCollection(content);

                // 2. Write modified collection to temp file
                fs.writeFileSync(tempFile, JSON.stringify(collection));

                // 3. Convert using temp file path
                await p2o(tempFile, outputPath, {
                    defaultTag: 'General',
                    requestText: 'name', // Use request name as summary
                    enableTags: true
                });
                console.log(`Success: ${outputPath}`);
            } catch (e) {
                console.error(`Failed to convert ${inputPath}:`, e.message);
                failed = true;
            }

            // 4. Clean up only if successful
            if (!failed && fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${src}:`, err.message);
    }
}

async function main() {
    console.log("Starting conversion with grouping by parent folder...");
    await convertDir(phrDir, phrOut);
    await convertDir(webDir, webOut);
    console.log("Conversion complete.");
}

main();
