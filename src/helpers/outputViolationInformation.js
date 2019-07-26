const chalk = require("chalk");
const log = require("./log");
const translateIssueGrouping = require("./translateIssueGrouping");
const reduceToMappedViolationTree = require("../reducers/violationTreeMapReducer");

function outputNodeResults(issueNode, index) {
  log(chalk.blue.bold(`Issue #${index + 1}`));
  log(chalk.cyan.bold(`Issue summary`));
  log(issueNode.failureSummary);
  log(chalk.cyan.bold(`Failing element(s) CSS selector`));
  log(issueNode.target.join(",\n"));
}

function outputViolationInformation(parsedResults) {
  parsedResults.forEach((failureGroup, index) => {
    const { violations, url } = failureGroup;
    const urlsWithIssues = reduceToMappedViolationTree(violations, url, {});

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
        const groupTitle = translateIssueGrouping(issueGrouping);

        log(`${chalk.yellow.bold(groupTitle)} (${totalIssues} ${postFix})`);
        if (minorIssues) {
          log(chalk.grey.bold.underline("Minor issues"));
          minor.forEach(outputNodeResults);
        }

        if (moderateIssues) {
          log(chalk.grey.bold.underline("Moderate issues"));
          moderate.forEach(outputNodeResults);
        }

        if (seriousIssues) {
          log(chalk.grey.bold.underline("Serious issues"));
          serious.forEach(outputNodeResults);
        }

        if (criticalIssues) {
          log(chalk.grey.bold.underline("Critical issues"));
          critical.forEach(outputNodeResults);
        }
      }
    }
  });
}

module.exports = outputViolationInformation;
