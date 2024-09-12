const fs = require("fs");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const dayjs = require("dayjs");
const readingTime = require("eleventy-plugin-reading-time");
module.exports = function (eleventyConfig) {
  // PLUGINS galore
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(readingTime);

  // SASS and ASSETS
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/admin");

  // FILTERS GO HERE
  const formatDate = (date, format) => dayjs(date).format(format);
  eleventyConfig.addFilter("formatDate", formatDate);

  // START COLLECTING RIGHT HERE

  // Published articles collection
  const now = new Date();
  const publishedPosts = (post) => post.date <= now && !post.data.draft;
  eleventyConfig.addCollection("posts", (collection) => {
    return collection
      .getFilteredByGlob("./src/content/articles/*.md")
      .filter(publishedPosts);
  });

  eleventyConfig.addCollection("appearancesByYear", function (collectionApi) {
    const allAppearances = collectionApi.getAll()[0].data.speakingAppearance;
    let appearances = allAppearances,
      // Create our placeholder array
      output = [];

    // Loop through each of the entries
    for (let item of appearances) {
      // Check we have both a date and title
      if (item.eventDate) {
        // create a date object and get the year
        let date = new Date(item.eventDate);
        let year = date.getFullYear();

        // If the year hasn't been seen before, make a stub object
        if (!output[year]) {
          output[year] = {
            year: year,
            appearances: [],
          };
        }

        // Add the entry to the keyed year/month array - only add the info we need
        output[year].appearances.push({
          eventName: item.eventName,
          place: item.place,
          talk: item.talk,
          role: item.role,
          url: item.url,
          eventDate: date,
        });
      }
    }
    // Return our array
    return (
      output
        // Reverse the months (most recent first)
        // Filter out any null years
        .filter((a) => a)
        // Reverse the years (recent first)
        .reverse()
    );
  });

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
