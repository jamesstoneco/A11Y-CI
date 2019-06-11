const { Command } = require("commander");
const { urlRegex } = require("./helpers/regexes");
const handleOutput = require("./helpers/handleOutput");
const runCrawler = require("./helpers/runCrawler");

function parseArguments(argv, program = new Command()) {
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
    streaming
  } = program;

  if (!site) {
    throw new Error(
      `The -s or --site flag is required alongside a valid URL path for the crawler to crawl`
    );
  }

  if (!urlRegex.test(site)) {
    throw new Error("Invalid URL provided");
  }

  return {
    outputFilePath,
    site,
    outputFileName,
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

async function runProgram() {
  const {
    site,
    crawlerConfig,
    outputFilePath,
    outputFileName
  } = parseArguments(process.argv);
  const results = await runCrawler(site, crawlerConfig);
  const violationsCount = results.violations.length;
  if (outputFilePath && outputFileName) {
    handleOutput(JSON.stringify(results), outputFilePath, outputFileName);
  }

  if (violationsCount > 0) {
    results.violations.forEach((error, index) => {
      const { impact, description, tags: failedStandards } = error;
      console.error(`
Error #${index + 1}

Error Description:
${description}

Impact:
${impact}

Failed standards:
${failedStandards.join(",\n")}
      `);
    });

    throw new Error(
      `Found ${violationsCount} errors. Please see output above for more details.`
    );
  }

  console.info("Well done, no violations found!");
}

module.exports = {
  runProgram,
  parseArguments
};
