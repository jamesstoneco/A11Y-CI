const { translateIssueGrouping } = require("./translate-issue-labels");

/**
 * @function violationUrlGroupingReducer
 * @param {Array<Object>} violations
 * @param {String} url
 * @returns {Object} the violations grouped by url, issue id and then impact level
 */
function violationUrlGroupingReducer(violations, url) {
  return violations.reduce((accumulator, current) => {
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
}

/**
 * @function outputNodeResults
 * @param {Object} issueNode
 * @param {Number} index
 * @returns {void}
 */
function outputNodeResults(issueNode, index) {
  console.log(`Issue #${index + 1}`);
  console.log(`Issue summary`);
  console.log(issueNode.failureSummary);
  console.log(`Failing element(s) CSS selector`);
  console.log(issueNode.target.join(",\n"));
}

/**
 * @function displayResults
 * @description takes the violations and logs all issues by grouping and severity
 * @see violationUrlGroupingReducer
 * @param {Array<Object>} results
 * @returns {void}
 */
function displayResults(results) {
  results.forEach((item, index) => {
    const { violations, url } = item;
    const groups = violationUrlGroupingReducer(violations, url);
    for (const [group, issues] of Object.entries(groups)) {
      for (const issue in issues) {
        const {
          minor = [],
          moderate = [],
          serious = [],
          critical = []
        } = issues[issue];
        const minorIssueCount = minor.length;
        const moderateIssueCount = moderate.length;
        const seriousIssueCount = serious.length;
        const criticalIssueCount = critical.length;
        const totalIssues =
          minorIssueCount +
          moderateIssueCount +
          seriousIssueCount +
          criticalIssueCount;
        const postFix = totalIssues === 1 ? "issue" : "issues";
        const groupTitle = translateIssueGrouping(issue);

        console.log(`${groupTitle} (${totalIssues} ${postFix})`);

        if (minorIssueCount > 0) {
          console.log("Minor issues");
          minor.forEach(outputNodeResults);
        }

        if (moderateIssueCount > 0) {
          console.log("Moderate issues");
          moderate.forEach(outputNodeResults);
        }

        if (seriousIssueCount > 0) {
          console.log("Serious issues");
          serious.forEach(outputNodeResults);
        }

        if (criticalIssueCount > 0) {
          console.log("Critical issues");
          critical.forEach(outputNodeResults);
        }
      }
    }
  });
}

module.exports = { displayResults };
