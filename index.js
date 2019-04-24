#!/usr/bin/env node

const program = require("commander");
const handleOutput = require("./helpers/handleOutput");
const runCrawler = require("./helpers/runCrawler");
const { urlRegex } = require("./helpers/regexes");

program
  .version("0.1.0", "-v, --version")
  .option(
    "-o, --output [path/to/output/directory]",
    "Output folder path",
    "results/"
  )
  .option(
    "-l, --limit [page count]",
    "Limit the amount of pages crawled",
    1000000
  )
  .option(
    "-f, --filename [filename]",
    "The name of the output file",
    "report.json"
  )
  .option("-s, --site [url]", "The base URL of the site to crawl")
  .parse(process.argv);

const {
  ignore: levelToIgnore,
  output: outputFilePath,
  limit: pageLimit,
  filename: outputFileName,
  site
} = program;

if (!site) {
  throw new Error(
    `The -s or --site flag is required alongside a valid URL path for the crawler to crawl`
  );
}

if (!urlRegex.test(site)) throw new Error("Invalid URL provided");

const crawlerConfig = {
  pageLimit
};

(async function runProgram() {
  const results = await runCrawler(site, crawlerConfig);

  if (outputFilePath) {
    handleOutput(JSON.stringify(results), outputFilePath, outputFileName);
  }
})();
