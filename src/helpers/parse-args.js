const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

const accessiblePipelineArgs = [
  { name: "ignoreExtensions", alias: "e", type: String, multiple: true },
  {
    name: "ignoreFragmentLinks",
    alias: "i",
    type: Boolean,
    defaultValue: false
  },
  { name: "pageLimit", alias: "l", type: Number },
  { name: "streaming", alias: "m", type: Boolean, defaultValue: true },
  { name: "numRetries", alias: "n", type: Number, defaultValue: 5 },
  {
    name: "ignoreQueryParams",
    alias: "q",
    type: Boolean,
    defaultValue: false
  },
  {
    name: "site",
    alias: "s",
    type: url => new URL(url),
    typeLabel: "{underline url}"
  }
];

const customArgs = [
  { name: "displayResults", alias: "d", type: Boolean, defaultValue: false },
  {
    name: "outputFileName",
    alias: "f",
    type: String
  },
  { name: "outputDirectory", alias: "o", type: String },
  { name: "errorAverageThreshold", alias: "t", type: Number, defaultValue: 5 },
  { name: "help", alias: "h", type: Boolean, defaultValue: false }
];

const options = [...accessiblePipelineArgs, ...customArgs].sort(
  (left, right) => {
    if (left.alias < right.alias) return -1;
    if (left.alias > right.alias) return 1;
    return 0;
  }
);

const help = [
  {
    header: "A11Y CI",
    content:
      "An accessibility checker for your web based projects and their CI pipelines"
  },
  {
    header: "Options",
    optionList: options
  }
];

module.exports = {
  args: commandLineArgs(options),
  help: commandLineUsage(help)
};
