module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
