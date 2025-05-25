// .eleventy.js
const { DateTime } = require("luxon"); // For date formatting
const slugify = require("slugify");   // For creating URL-friendly slugs

module.exports = function(eleventyConfig) {

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
    eleventyConfig.addCollection("actualites", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/fr/actualites/**/*.md").sort((a, b) => {
            return b.date - a.date; // Sort by date, newest first
        });
    });

    // Posts grouped by Category
    eleventyConfig.addCollection("postsByCategory", (collectionApi) => {
        const posts = collectionApi.getFilteredByTag("actualites");
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
    eleventyConfig.addCollection("uniqueCategories", (collectionApi) => {
        const posts = collectionApi.getFilteredByTag("actualites");
        let uniqueCategories = new Set();
        posts.forEach(post => {
            if (post.data.category && typeof post.data.category === 'string' && post.data.category.trim() !== '') {
                uniqueCategories.add(post.data.category.trim());
            }
        });
        return Array.from(uniqueCategories).sort();
    });
  
    // --- Nunjucks Filters ---
    // Date Filter (e.g., 25 mai 2025)
    eleventyConfig.addNunjucksFilter("date", function(dateObj, format = "dd LLLL yyyy", locale = "fr") {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).setLocale(locale).toFormat(format);
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