const fs = require('fs');
const path = require('path');

/**
 * Parses command line arguments into a key-value object.
 * @param {string[]} argv - The process.argv array.
 * @returns {object} - A map of arguments.
 */
function parseArgs(argv) {
    const args = {};
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
            args[key] = value;
            if (value !== true) i++; // Skip next value if it was consumed
        }
    }
    return args;
}

/**
 * Resolves a user-provided path. If relative, it's prepended with '<cwd>/data/'.
 * If no user path is given, it returns a path based on the default, relative to the script's directory.
 * @param {string} userPath - The file path from the user argument.
 * @param {string} defaultPath - The default path (e.g., 'src/survey.json').
 * @returns {string} - The resolved absolute path.
 */
function resolvePath(userPath, defaultPath) {
    if (userPath) {
        // Path is provided by the user
        if (path.isAbsolute(userPath)) {
            return userPath;
        } else {
            // It's a relative path from the user, prepend <cwd>/data/
            return path.join(process.cwd(), 'data', userPath);
        }
    }
    // No user path, use the default path relative to the script's directory (__dirname)
    return path.join(__dirname, defaultPath);
}

// --- Main Execution ---

try {
    const args = parseArgs(process.argv);

    // Resolve input and output paths
    const jsonFilePath = resolvePath(args.input, 'src/survey.json');
    const outputHtmlPath = resolvePath(args.output, 'dist/survey.html');

    // The rest of the source files are assumed to be in the hardcoded `src` directory
    const srcDir = path.join(__dirname, 'src');
    const htmlFilePath = path.join(srcDir, 'index.html');
    const cssFilePath = path.join(srcDir, 'style.css');
    const jsFilePath = path.join(srcDir, 'app.js');

    console.log(`Input survey JSON: ${jsonFilePath}`);
    console.log(`Output HTML file: ${outputHtmlPath}`);

    // 1. Ensure output directory exists
    const outputDir = path.dirname(outputHtmlPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. Read all source files
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');

    // 3. Embed CSS
    htmlContent = htmlContent.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssContent}</style>`
    );

    // 4. Embed JSON data
    const jsonScript = `<script id="survey-data" type="application/json">${jsonContent}</script>`;

    // 5. Embed JavaScript
    htmlContent = htmlContent.replace(
        '<script src="app.js"></script>',
        `${jsonScript}\n<script>${jsContent}</script>`
    );

    // 6. Write the final, self-contained HTML file
    fs.writeFileSync(outputHtmlPath, htmlContent);

    console.log(`\nSuccessfully created self-contained survey at: ${outputHtmlPath}`);

} catch (error) {
    console.error('\nError during build process:', error.message);
    process.exit(1);
}
