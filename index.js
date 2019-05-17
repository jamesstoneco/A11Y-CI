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
  .option(
      "-n, --num-retries [retries]",
      "How often the connection should be retried before failing",
      5
  )
  .option(
      "--ignore-fragment-links",
      "Skip links that only change the url fragment of a page?"
  )
  .option(
      "--ignore-extensions [extensions]",
      "Comma separated list of extensions to ignore (skipping pages)",
      s => s.split(","),
      []
  )
  .option(
      "--route-manifest [path]",
      "A path to a route manifest file, used to de-duplicate visited pages and routes"
  )
  .option(
      "--streaming",
      `Whether to expose the streaming logging API, used for advanced, "live" reporters`
  )
  .option("-s, --site <url>", "The base URL of the site to crawl")
  .parse(process.argv);

const {
  ignore: levelToIgnore,
  output: outputFilePath,
  limit: pageLimit,
  filename: outputFileName,
  numRetries: maxRetries,
  routeManifest: routeManifestPath,
  site,
  streaming,
  ignoreExtensions,
  ignoreFragmentLinks
} = program;

if (!site) {
  throw new Error(
    `The -s or --site flag is required alongside a valid URL path for the crawler to crawl`
  );
}

if (!urlRegex.test(site)) throw new Error("Invalid URL provided");

const crawlerConfig = {
  pageLimit,
  maxRetries,
  ignoreFragmentLinks,
  ignoreExtensions,
  routeManifestPath,
  streaming
};

console.log(JSON.stringify(crawlerConfig, null, 2));
process.exit(0);

(async function runProgram() {
  const results = await runCrawler(site, crawlerConfig);

  if (outputFilePath) {
    handleOutput(JSON.stringify(results), outputFilePath, outputFileName);
  }
})();
