const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { JSDOM } = require('jsdom');

const LANGS = [
  { code: 'fr', dir: 'Fr', index: 'search-index.fr.json' },
  { code: 'en', dir: 'En', index: 'search-index.en.json' },
  { code: 'nl', dir: 'Nl', index: 'search-index.nl.json' }
];

function extractTextFromHtml(html) {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent.replace(/\s+/g, ' ').trim();
}

function getFiles(dir, exts = ['.html', '.njk', '.md']) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

function getUrlFromFile(file, lang) {
  // Remove src/XX/ and extension, add leading slash and language
  let rel = file.replace(/\\/g, '/').replace(/^src\/(Fr|En|Nl)\//, '');
  rel = rel.replace(/index\.html$/, '');
  rel = rel.replace(/\.(html|njk|md)$/, '');
  if (!rel.endsWith('/')) rel += '/';
  return `/${lang}/${rel}`;
}

function buildIndex(lang, dir, outFile) {
  const baseDir = path.join(__dirname, 'src', dir);
  const files = getFiles(baseDir);
  const index = [];

  files.forEach(file => {
    const raw = fs.readFileSync(file, 'utf8');
    let data = {};
    let content = raw;

    // Try to parse front matter
    try {
      const parsed = matter(raw);
      data = parsed.data;
      content = parsed.content;
    } catch {}

    // Try to extract title/description from front matter or HTML
    let title = data.title || '';
    let summary = data.description || '';
    let body = content;

    // If HTML, extract <title> and <meta name="description">
    if (file.endsWith('.html') || file.endsWith('.njk')) {
      try {
        const dom = new JSDOM(raw);
        if (!title) {
          const t = dom.window.document.querySelector('title');
          if (t) title = t.textContent;
        }
        if (!summary) {
          const d = dom.window.document.querySelector('meta[name="description"]');
          if (d) summary = d.getAttribute('content');
        }
        body = dom.window.document.body ? dom.window.document.body.textContent : '';
      } catch {}
    }

    // Clean up
    title = title ? title.trim() : '';
    summary = summary ? summary.trim() : '';
    body = body ? body.replace(/\s+/g, ' ').trim() : '';

    // Skip empty or utility pages
    if (!title || !body) return;
    if (/404|merci|thank-you|bedankt|offline|hors-ligne/.test(file)) return;

    index.push({
      title,
      url: getUrlFromFile(file, lang),
      summary,
      content: body.slice(0, 2000)
    });
  });

  fs.writeFileSync(path.join(__dirname, 'src', outFile), JSON.stringify(index, null, 2), 'utf8');
  console.log(`Wrote ${index.length} entries to ${outFile}`);
}

LANGS.forEach(({ code, dir, index }) => buildIndex(code, dir, index)); 