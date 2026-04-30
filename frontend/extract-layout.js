const fs = require('fs');
const path = require('path');

const srcCompPath = path.join(__dirname, 'src/app/component');
const dirs = fs.readdirSync(srcCompPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'navbar' && dirent.name !== 'footer')
    .map(dirent => dirent.name);

let navbarExtracted = false;
let footerExtracted = false;

dirs.forEach(dir => {
    const htmlPath = path.join(srcCompPath, dir, `${dir}.html`);
    if (!fs.existsSync(htmlPath)) return;

    let content = fs.readFileSync(htmlPath, 'utf8');

    // Extract nav
    const navMatch = content.match(/<nav class="navbar">[\s\S]*?<\/nav>/i) || content.match(/<nav[^>]*>[\s\S]*?<\/nav>/i);
    if (navMatch) {
        if (!navbarExtracted) {
            fs.writeFileSync(path.join(srcCompPath, 'navbar', 'navbar.html'), navMatch[0]);
            navbarExtracted = true;
        }
        content = content.replace(navMatch[0], '');
    }

    // Extract footer
    const footMatch = content.match(/<footer class="footer">[\s\S]*?<\/footer>/i) || content.match(/<footer[^>]*>[\s\S]*?<\/footer>/i);
    if (footMatch) {
        if (!footerExtracted) {
            fs.writeFileSync(path.join(srcCompPath, 'footer', 'footer.html'), footMatch[0]);
            footerExtracted = true;
        }
        content = content.replace(footMatch[0], '');
    }

    // Add back the app-navbar and app-footer at app.html instead of each component!
    // So we just save the cleaned content.
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`Cleaned ${dir}.html`);
});
