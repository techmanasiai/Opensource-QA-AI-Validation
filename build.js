const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const htmlFilePath = path.join(srcDir, 'index.html');
const jsonFilePath = path.join(srcDir, 'survey.json');
const cssFilePath = path.join(srcDir, 'style.css');
const jsFilePath = path.join(srcDir, 'app.js');

const outputHtmlPath = path.join(distDir, 'survey.html');

try {
    // 1. Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    // 2. Read all source files
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');

    // 3. Embed CSS
    // Replace <link rel="stylesheet" href="style.css"> with <style>...</style>
    htmlContent = htmlContent.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssContent}</style>`
    );

    // 4. Embed JSON data
    // We will add a script tag with the JSON content before the main app script.
    const jsonScript = `<script id="survey-data" type="application/json">${jsonContent}</script>`;

    // 5. Embed JavaScript
    // Replace <script src="app.js"></script> with <script>...</script>
    htmlContent = htmlContent.replace(
        '<script src="app.js"></script>',
        `${jsonScript}\n<script>${jsContent}</script>`
    );

    // 6. Write the final, self-contained HTML file
    fs.writeFileSync(outputHtmlPath, htmlContent);

    console.log(`Successfully created self-contained survey at: ${outputHtmlPath}`);

} catch (error) {
    console.error('Error during build process:', error);
    process.exit(1);
}
