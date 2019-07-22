const { runCore: crawler } = require("accessible-pipeline");

module.exports = async function runCrawler(site, crawlerConfig) {
  const url = new URL(site);
  const { results } = await crawler(url, crawlerConfig);
  return results;
};
