const handleOutput = require("./helpers/handleOutput");
const parseArguments = require("./helpers/parseArguments");
const runCrawler = require("./helpers/runCrawler");
const chalk = require("chalk");
const { log, logList } = require("./helpers/log");

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
    console.log(results.violations[0]);
    results.violations.forEach((error, index) => {
      const { impact, description, tags: failedStandards, nodes } = error;
      log(chalk.red.bold(description));
      log("Impact", impact);
      logList("Failed standards", failedStandards);
      logList(
        "Affected nodes",
        nodes.map(n => `${n.target[0]}\n\n${n.failureSummary}`)
      );
    });

    return log(
      chalk.red.bold(
        `Found ${violationsCount} errors. Please see output above for more details.`
      )
    );
  }

  log(chalk.green.bold("• Well done, no violations found!"));
}

module.exports = runProgram;
