// .eleventy.js
module.exports = function(eleventyConfig) {

    // --- Passthrough Copy for Static Assets ---
    // Tells Eleventy to copy these folders from "src" directly to the output folder "_site"
    // Make sure these paths match where you place your assets INSIDE the src folder
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/fonts");
    eleventyConfig.addPassthroughCopy("src/videos");
    // eleventyConfig.addPassthroughCopy("src/pdfs"); // Example if you have PDFs

    // --- Add Shortcode for Current Year --- ADD THIS LINE ---
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  // --- End Shortcode ---
  
    // --- Set input and output directories ---
    return {
      dir: {
        input: "src",      // Look for pages/layouts/data inside the src folder
        includes: "_includes", // Partials & layouts relative to input folder (src/_includes)
        data: "_data",     // Global data relative to input folder (src/_data)
        output: "_site"    // Where the final static site will be built
      },
      // Allows HTML files to use templating features (like includes)
      htmlTemplateEngine: "njk",
      markdownTemplateEngine: "njk" // Allows Markdown files to use features too
    };
  };