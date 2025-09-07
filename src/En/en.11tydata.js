// Directory data for all English pages: inject default head extras (BreadcrumbList + WebPage)
const SITE = "https://diaeta.be";

module.exports = {
  lang: "en",
  eleventyComputed: {
    og_image: (data) => data.og_image || "/images/weightloss-hero-large-optimized.jpg",
    head_extra: (data) => {
      try {
        const url = (data.page && data.page.url) ? (SITE + (data.page.url.toLowerCase().replace(/index\.html$/, ""))) : undefined;
        const isHome = !!(data.page && data.page.url && (data.page.url.toLowerCase() === "/en/" || data.page.url.toLowerCase() === "/en/index.html"));
        const title = data.title || "Diaeta";
        const description = data.description || "Diaeta: Accredited dietitian-nutrition services in Brussels.";

        let blocks = [];

        // Append existing head_extra if present
        if (data.head_extra) blocks.push(data.head_extra);

        // BreadcrumbList for non-home English pages
        if (!isHome && url) {
          const breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Diaeta Home", "item": `${SITE}/en/` },
              { "@type": "ListItem", "position": 2, "name": title, "item": url }
            ]
          };
          blocks.push(`<script type="application/ld+json">\n${JSON.stringify(breadcrumb)}\n<\/script>`);
        }

        // WebPage schema for English pages (including home, complementary to site-wide Organization)
        if (url) {
          const webpage = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "url": url,
            "name": title,
            "inLanguage": "en",
            "description": description,
            "isPartOf": { "@id": `${SITE}#organization` }
          };
          blocks.push(`<script type=\"application/ld+json\">\n${JSON.stringify(webpage)}\n<\/script>`);
        }

        return blocks.join("\n");
      } catch (e) {
        return data.head_extra || "";
      }
    }
  }
};

