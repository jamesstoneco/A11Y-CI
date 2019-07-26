const handleOutput = require("./helpers/handleOutput");
const parseCLIArguments = require("./helpers/parseCLIArguments");
const runCrawler = require("./helpers/runCrawler");
const log = require("./helpers/log");
const parseReportResults = require("./helpers/parseReportResults");
const outputViolationInformation = require("./helpers/outputViolationInformation");
const getViolationNodesCount = require("./reducers/violationNodeCountReducer");
const chalk = require("chalk");

async function runProgram() {
  const {
    site,
    crawlerConfig,
    outputFilePath,
    outputFileName,
    errorAverageThreshold
  } = parseCLIArguments(process.argv);
  const results = await runCrawler(site, crawlerConfig);
  const parsedResults = parseReportResults(results);
  const violationsCount = getViolationNodesCount(parsedResults);
  const pageCount = parsedResults.length;
  const averageErrors = violationsCount / pageCount;

  if (outputFilePath && outputFileName) {
    handleOutput(JSON.stringify(parsedResults), outputFilePath, outputFileName);
  }

  if (violationsCount === 0) {
    return log(chalk.green.bold("Well done, no violations found!"));
  }

  outputViolationInformation(parsedResults);
  log(chalk.red.bold(`Total accessibility issues: ${violationsCount}`));
  log(chalk.red.bold(`Average errors: ${averageErrors}`));
  log(chalk.red.bold(`Threshold: ${errorAverageThreshold}`));

  if (averageErrors > errorAverageThreshold) {
    log(chalk.red.bold(`Difference: ${averageErrors - errorAverageThreshold}`));
    log(
      chalk.red.bold(
        `CI Failed. Reason: Error average went above the threshold.`
      )
    );

    process.exitCode = 1;
    return;
  }

  return log(
    chalk.red.bold(
      `CI run complete but ${violationsCount} issues require review.`
    )
  );
}

module.exports = runProgram;
