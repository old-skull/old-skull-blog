const eleventySass = require('eleventy-sass');
const codeStyleHooks = require('eleventy-plugin-code-style-hooks');
const prism = require('./prism');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/favicon.ico');

  eleventyConfig.addPlugin(codeStyleHooks, {
    prism,
    lineNumbers: false,
  });
  eleventyConfig.addPlugin(eleventySass, {
    sass: {
      loadPaths: 'src/styles',
      sourceMap: false,
      style: 'compressed',
    },
  });

  return {
    passthroughFileCopy: true,
    dir: { input: 'src', output: 'build' },
  };
};
