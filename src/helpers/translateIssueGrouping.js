const { issueTranslations } = require("../constants");

function translateIssueGrouping(translateKey) {
  const { translated } = issueTranslations().find(
    issueGroup => issueGroup.original === translateKey
  );

  return translated;
}

module.exports = { translateIssueGrouping };
