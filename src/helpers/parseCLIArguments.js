const chalk = require("chalk");
const { Command } = require("commander");
const { log } = require("./log");
const { isURL } = require("./isURL");

function parseCLIArguments(argv, program = new Command()) {
  program
    .version("0.1.0", "-v, --version")
    .option(
      "-o, --output <path/to/output/directory>",
      "Output folder path",
      "results/"
    )
    .option(
      "-l, --limit <page count>",
      "Limit the amount of pages crawled",
      1000000
    )
    .option(
      "-f, --filename <filename>",
      "The name of the output file",
      "report.json"
    )
    .option(
      "-n, --num-retries <retries>",
      "How often the connection should be retried before failing",
      5
    )
    .option(
      "--ignore-fragment-links",
      "Skip links that only change the url fragment of a page?"
    )
    .option(
      "--ignore-extensions <extensions>",
      "Comma separated list of extensions to ignore (skipping pages)",
      s => s.split(",")
    )
    .option(
      "--route-manifest <path>",
      "A path to a route manifest file, used to de-duplicate visited pages and routes"
    )
    .option(
      "--streaming",
      `Whether to expose the streaming logging API, used for advanced, "live" reporters`
    )
    .option("-s, --site <url>", "The base URL of the site to crawl")
    .option(
      "-t, --errorAverageThreshold <number>",
      "If the average errors per page (error_count / page_count) go over the threshold, the pipeline will fail",
      5
    )
    .parse(argv);

  const {
    site,
    output: outputFilePath,
    filename: outputFileName,
    limit: pageLimit,
    numRetries: maxRetries,
    ignoreFragmentLinks,
    ignoreExtensions,
    routeManifest: routeManifestPath,
    streaming,
    errorAverageThreshold
  } = program;

  if (!site) {
    log(
      chalk.red.bold(
        "The -s or --site flag is required alongside a valid URL path for the crawler to crawl"
      )
    );
  }

  if (!isURL(site)) {
    log(chalk.red.bold("Invalid URL provided"));
  }

  return {
    outputFilePath,
    site,
    outputFileName,
    errorAverageThreshold,
    crawlerConfig: {
      pageLimit: parseInt(pageLimit),
      maxRetries: parseInt(maxRetries),
      ignoreFragmentLinks,
      ignoreExtensions,
      routeManifestPath,
      streaming
    }
  };
}
module.exports = { parseCLIArguments };
