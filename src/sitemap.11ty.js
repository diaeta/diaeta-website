const { DateTime } = require("luxon");

// Language mapping for hreflang
const LANGS = [
  { code: "en", hreflang: "en", path: "/en/" },
  { code: "fr", hreflang: "fr-be", path: "/fr/" },
  { code: "nl", hreflang: "nl-be", path: "/nl/" },
  // { code: "de", hreflang: "de-be", path: "/de/" }, // Uncomment for German later
];
const X_DEFAULT = "/en/";
const SITE = "https://diaeta.be";

// Helper: Infer language from URL if not set
function inferLang(url) {
  url = url.toLowerCase();
  if (url.startsWith('/fr/')) return 'fr';
  if (url.startsWith('/en/')) return 'en';
  if (url.startsWith('/nl/')) return 'nl';
  return 'en'; // fallback
}

function getLastMod(page) {
  // Prefer dateModified, fallback to date
  const d = page.data.dateModified || page.date;
  if (!d) return null;
  return DateTime.fromJSDate(d, {zone: 'utc'}).toISODate();
}

function getPriority(page) {
  // Allow override in frontmatter, else default
  if (typeof page.data.priority === 'number') return page.data.priority;
  // Homepages highest, then main sections, then posts
  if (page.url.match(/^\/(en|fr|nl)\/(index\.html)?$/)) return 1.0;
  if (page.url.match(/^\/(en|fr|nl)\/(actualites|news|nieuws|cabinets|locations|locaties|tariffs|tarifs|contact|privacy|cookie|legal|mentions|wettelijke|policy|beleid|tests|test|method|methode|expertise|notre-expertise|onze-expertise|our-expertise)\//)) return 0.8;
  return 0.5;
}

function getChangeFreq(page) {
  // Allow override in frontmatter, else default
  if (typeof page.data.changefreq === 'string') return page.data.changefreq;
  // Homepages and main sections: weekly, posts: monthly
  if (page.url.match(/^\/(en|fr|nl)\/(index\.html)?$/)) return 'weekly';
  if (page.url.match(/^\/(en|fr|nl)\/(actualites|news|nieuws|cabinets|locations|locaties|tariffs|tarifs|contact|privacy|cookie|legal|mentions|wettelijke|policy|beleid|tests|test|method|methode|expertise|notre-expertise|onze-expertise|our-expertise)\//)) return 'weekly';
  return 'monthly';
}

function isNoIndex(page) {
  // Check frontmatter or robots meta
  if (page.data.noindex === true) return true;
  if (typeof page.data.robots === 'string' && page.data.robots.includes('noindex')) return true;
  return false;
}

function isDraft(page) {
  // Check Eleventy draft convention
  if (page.data.draft === true) return true;
  if (page.data.published === false) return true;
  return false;
}

module.exports = class {
  data() {
    return {
      permalink: "/sitemap.xml",
      eleventyExcludeFromCollections: true,
      layout: null,
      eleventyComputed: {},
      // Output as XML
      contentType: "application/xml"
    };
  }

  // Helper: Group alternates by logical page (by a shared key, lowercased, with lang inference)
  groupAlternates(pages) {
    const groups = {};
    for (const page of pages) {
      if (!page.url || !page.url.endsWith('.html')) continue;
      let url = page.url.toLowerCase();
      let key = url.replace(/^\/(en|fr|nl)\//, '/');
      key = key.replace(/index\.html$/, '');
      // Use lang from data, or infer from URL
      const lang = (page.data.lang || inferLang(url)).toLowerCase();
      if (!groups[key]) groups[key] = {};
      groups[key][lang] = page;
    }
    return groups;
  }

  render({ collections }) {
    const allPages = collections.all || [];
    const grouped = this.groupAlternates(allPages);
    let xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n`;
    xml += `<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n`;
    xml += `        xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n`;
    for (const [key, alternates] of Object.entries(grouped)) {
      const canonical = alternates['en'] || alternates['fr'] || alternates['nl'];
      if (!canonical) continue;
      if (isDraft(canonical) || isNoIndex(canonical)) continue;
      const canonicalUrl = SITE + canonical.url.toLowerCase().replace(/index\.html$/, '');
      xml += `  <url>\n`;
      xml += `    <loc>${canonicalUrl}</loc>\n`;
      for (const lang of LANGS) {
        if (alternates[lang.code] && !isDraft(alternates[lang.code]) && !isNoIndex(alternates[lang.code])) {
          xml += `    <xhtml:link rel=\"alternate\" hreflang=\"${lang.hreflang}\" href=\"${SITE}${alternates[lang.code].url.toLowerCase().replace(/index\.html$/, '')}\" />\n`;
        }
      }
      if (alternates['en'] && !isDraft(alternates['en']) && !isNoIndex(alternates['en'])) {
        xml += `    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"${SITE}${alternates['en'].url.toLowerCase().replace(/index\.html$/, '')}\" />\n`;
      }
      const lastmod = getLastMod(canonical);
      if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <priority>${getPriority(canonical)}</priority>\n`;
      xml += `    <changefreq>${getChangeFreq(canonical)}</changefreq>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>\n`;
    return xml;
  }
}; 