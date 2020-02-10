const { runCore: crawler } = require("accessible-pipeline");
const { args, help } = require("./helpers/parse-args");
const { getViolations } = require("./helpers/parse-report-results");
const { getViolationNodesCount } = require("./helpers/count-violation-nodes");
const { writeReportFile } = require("./helpers/write-report");
const { displayResults } = require("./helpers/display-results");

/**
 * @function runProgram
 * @description entry point to running the CLI
 * @returns {void} Nothing since everything is output via logs or errors
 */
async function runProgram() {
  if (args.help === true) {
    return console.log(help);
  }

  const { results } = await crawler(args.site, args);
  const violations = getViolations(results);
  const violationsCount = getViolationNodesCount(violations);
  const pageCount = violations.length;
  const averageErrors = Math.round((violationsCount / pageCount) * 100) / 100;

  await writeReportFile(violations, args.outputDirectory, args.outputFileName);

  if (violationsCount === 0) {
    return console.log("Well done, no violations found!");
  }

  if (args.displayResults === true) {
    displayResults(violations);
  }

  console.log(`Total accessibility issues: ${violationsCount}`);
  console.log(`Average errors: ${averageErrors}`);
  console.log(`Threshold: ${args.errorAverageThreshold}`);

  if (averageErrors > args.errorAverageThreshold) {
    console.error(
      `CI Failed: Average errors of ${averageErrors} were above the defined threshold of ${args.errorAverageThreshold}`
    );
    process.exitCode = 1;
  } else {
    console.log(
      `CI run complete but ${violationsCount} ${
        violations === 1 ? "issue" : "issues"
      } require review.`
    );
  }
}

module.exports = { runProgram };
