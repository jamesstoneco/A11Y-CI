const handleOutput = require("./helpers/handleOutput");
const parseCLIArguments = require("./helpers/parseCLIArguments");
const runCrawler = require("./helpers/runCrawler");
const log = require("./helpers/log");
const parseReportResults = require("./helpers/parseReportResults");
const chalk = require("chalk");

async function runProgram() {
  const {
    site,
    crawlerConfig,
    outputFilePath,
    outputFileName
  } = parseCLIArguments(process.argv);
  const results = await runCrawler(site, crawlerConfig);
  const parsedResults = parseReportResults(results);
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
          if (minorIssues) {
            log(chalk.green("Minor issues"));
            minor.forEach(outputNodeResults);
          }

          if (moderateIssues) {
            log(chalk.green("Moderate issues"));
            moderate.forEach(outputNodeResults);
          }

          if (seriousIssues) {
            log(chalk.green("Serious issues"));
            serious.forEach(outputNodeResults);
          }

          if (criticalIssues) {
            log(chalk.green("Critical issues"));
            critical.forEach(outputNodeResults);
          }
        }
      }
    });

    return log(
      chalk.red.bold(
        `• Found ${violationsCount} elements with errors over ${pageCount} pages, that is an average of ${Math.round(
          violationsCount / pageCount
        )} per page.`
      )
    );
  }

  log(chalk.green.bold("• Well done, no violations found!"));
}

module.exports = runProgram;
