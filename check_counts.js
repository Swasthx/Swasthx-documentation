const fs = require('fs');
const jsYaml = require('js-yaml');

const jsonFile = 'assets/specs/website_collections/web-abdm-endpoints.json';
const yamlFile = 'assets/openapi/website/web-abdm-endpoints.yaml';

function countPostmanRequests(items) {
    let count = 0;
    for (const item of items) {
        if (item.request) {
            count++;
        }
        if (item.item) {
            count += countPostmanRequests(item.item);
        }
    }
    return count;
}

try {
    const jsonContent = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const requestCount = countPostmanRequests(jsonContent.item || []);
    console.log(`Postman Requests: ${requestCount}`);

    const yamlContent = jsYaml.load(fs.readFileSync(yamlFile, 'utf8'));
    const pathCount = yamlContent.paths ? Object.keys(yamlContent.paths).length : 0;

    // Count total operations (methods) not just paths
    let opCount = 0;
    if (yamlContent.paths) {
        for (const p in yamlContent.paths) {
            opCount += Object.keys(yamlContent.paths[p]).length;
        }
    }
    console.log(`OpenAPI Paths: ${pathCount}`);
    console.log(`OpenAPI Operations: ${opCount}`);

} catch (e) {
    console.error(e);
}
