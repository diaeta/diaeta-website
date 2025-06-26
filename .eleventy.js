// .eleventy.js
const { DateTime } = require("luxon"); // For date formatting
const slugify = require("slugify");   // For creating URL-friendly slugs
const { EleventyI18nPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {

    // --- I18n Plugin ---
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "en" // Set a default language
    });

    // --- Passthrough Copy for Static Assets ---
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/images/actualites"); // For blog images
    eleventyConfig.addPassthroughCopy("src/images/cabinets");   // For cabinet images
    eleventyConfig.addPassthroughCopy("src/fonts");
    eleventyConfig.addPassthroughCopy("src/videos");
    eleventyConfig.addPassthroughCopy("src/_data/cabinets.json"); // To make cabinets.json available if needed client-side

    // --- Add Shortcode for Current Year ---
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  
    // --- Collections ---
    // Blog Posts ("Actualités")
    // Updated to support multiple languages. It will now fetch posts from the 'actualites' subdirectory
    // of the current processing language's content directory.
    eleventyConfig.addCollection("actualites", function(collectionApi) {
        // This will get all markdown files from any 'actualites' folder,
        // for example, src/en/actualites/*.md, src/fr/actualites/*.md, etc.
        // The i18n plugin will handle filtering by locale automatically for page generation.
        // For collections that need to be language-aware for display (e.g. related posts in the same language),
        // you might need to filter by `page.lang` within the collection or template.
        return collectionApi.getFilteredByGlob("./src/*/actualites/**/*.md").sort((a, b) => {
            return b.date - a.date; // Sort by date, newest first
        });
    });

    // Posts grouped by Category
    // This collection also needs to be language-aware.
    // We'll group by category within each language.
    eleventyConfig.addCollection("postsByCategory", (collectionApi) => {
        const posts = collectionApi.getFilteredByGlob("./src/*/actualites/**/*.md");
        const categories = {};
        posts.forEach(post => {
            const category = post.data.category;
            if (category) {
                const trimmedCategory = category.trim();
                if (!categories[trimmedCategory]) {
                    categories[trimmedCategory] = [];
                }
                categories[trimmedCategory].push(post);
            }
        });
        // Sort posts within each category by date
        for (const categoryKey in categories) {
            categories[categoryKey].sort((a, b) => b.date - a.date);
        }
        return categories;
    });

    // Unique Category List
    // This also needs to be language-aware if categories are language-specific.
    // For now, it collects all unique categories across all languages.
    // If categories need to be per-language, this logic would need further refinement,
    // possibly by creating separate collections per language or filtering by page.lang in templates.
    eleventyConfig.addCollection("uniqueCategories", (collectionApi) => {
        const posts = collectionApi.getFilteredByGlob("./src/*/actualites/**/*.md");
        let uniqueCategories = new Set();
        posts.forEach(post => {
            if (post.data.category && typeof post.data.category === 'string' && post.data.category.trim() !== '') {
                uniqueCategories.add(post.data.category.trim()); // Categories might need translation too
            }
        });
        return Array.from(uniqueCategories).sort();
    });
  
    // --- Nunjucks Filters ---
    // Date Filter (e.g., 25 mai 2025)
    // The locale parameter will now be dynamically set by page.lang if available
    eleventyConfig.addNunjucksFilter("date", function(dateObj, format = "dd LLLL yyyy", locale) {
        const pageLocale = this.ctx.page?.lang || this.ctx.lang || "fr"; // Fallback to 'fr' or a default
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).setLocale(locale || pageLocale).toFormat(format);
    });
    
    // Date ISO Filter (e.g., 2025-05-25T00:00:00.000Z)
    eleventyConfig.addNunjucksFilter("dateISO", function(dateObj) {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toISO();
    });
    
    // Slugify Filter
    eleventyConfig.addFilter("slugify", function(str) {
        if (!str) return ""; 
        return slugify(str, {
            lower: true,
            strict: true,
            remove: /[#,&,+()$~%.'":*?<>{}]/g
        });
    });

    // Truncate Filter
    eleventyConfig.addFilter("truncate", function(str, len) {
        if (!str) return "";
        const plainText = str.replace(/<[^>]+>/g, ''); // Basic strip tags
        if (plainText.length <= len) return plainText;
        
        let truncated = plainText.substring(0, len);
        const lastSpace = truncated.lastIndexOf(" ");
        if (lastSpace > 0) {
            truncated = truncated.substring(0, lastSpace);
        }
        return truncated + "...";
    });

    // --- Set input and output directories ---
    return {
      dir: {
        input: "src",
        includes: "_includes",
        data: "_data",
        output: "_site"
      },
      htmlTemplateEngine: "njk",
      markdownTemplateEngine: "njk"
    };
};