const handleOutput = require("./helpers/handleOutput");
const parseArguments = require("./helpers/parseArguments");
const runCrawler = require("./helpers/runCrawler");
const ReportParsingService = require("./services/ReportParsingService");
const chalk = require("chalk");
function log(message) {
  console.log(message);
  console.log("");
}

async function runProgram() {
  const {
    site,
    crawlerConfig,
    outputFilePath,
    outputFileName
  } = parseArguments(process.argv);
  const results = await runCrawler(site, crawlerConfig);
  const reportParser = new ReportParsingService();
  const parsedResults = reportParser.parse(results);
  const pageCount = parsedResults.length;
  const violationsCount = parsedResults.reduce((accumulator, current) => {
    const { violations } = current;
    const nodeCount = violations.reduce((accumulator, current) => {
      const { nodes } = current;
      return accumulator + nodes.length;
    }, 0);
    return accumulator + nodeCount;
  }, 0);

  if (outputFilePath && outputFileName) {
    handleOutput(JSON.stringify(parsedResults), outputFilePath, outputFileName);
  }

  if (violationsCount > 0) {
    parsedResults.forEach((failureGroup, index) => {
      const { violations, url } = failureGroup;
      const urlsWithIssues = violations.reduce((accumulator, current) => {
        const { nodes, id } = current;
        nodes.forEach(node => {
          const { impact } = node;
          if (!accumulator[url]) accumulator[url] = {};
          if (!accumulator[url][id]) accumulator[url][id] = {};
          if (!accumulator[url][id][impact]) accumulator[url][id][impact] = [];
          accumulator[url][id][impact].push(node);
        });
        return accumulator;
      }, {});

      for (const url in urlsWithIssues) {
        const issues = urlsWithIssues[url];
        log(chalk.magenta.bold(url));
        for (const issueGrouping in issues) {
          const {
            minor = [],
            moderate = [],
            serious = [],
            critical = []
          } = issues[issueGrouping];
          const minorIssues = minor.length;
          const moderateIssues = moderate.length;
          const seriousIssues = serious.length;
          const criticalIssues = critical.length;
          const totalIssues =
            minorIssues + moderateIssues + seriousIssues + criticalIssues;
          const postFix = totalIssues === 1 ? "issue" : "issues";

          function outputNodeResults(issueNode, index) {
            log(chalk.blue.bold(`Selector with issue #${index + 1}`));
            log(issueNode.target[0]);
            log(chalk.blue.bold(`Summary of issue #${index + 1}`));
            log(issueNode.failureSummary);
          }

          log(
            `${chalk.yellow.bold(issueGrouping)} (${totalIssues} ${postFix})`
          );
          if (minor.length) {
            log(chalk.green("Minor issues"));
          }
          minor.forEach(outputNodeResults);

          if (moderate.length) {
            log(chalk.green("Moderate issues"));
          }
          moderate.forEach(outputNodeResults);

          if (serious.length) {
            log(chalk.green("Serious issues"));
          }
          serious.forEach(outputNodeResults);

          if (critical.length) {
            log(chalk.green("Critical issues"));
          }
          critical.forEach(outputNodeResults);
        }
      }
    });

    return log(
      chalk.red.bold(
        `Found ${violationsCount} elements with errors over ${pageCount} pages, that is an average of ${Math.round(
          violationsCount / pageCount
        )} per page.`
      )
    );
  }

  log(chalk.green.bold("• Well done, no violations found!"));
}

module.exports = runProgram;
