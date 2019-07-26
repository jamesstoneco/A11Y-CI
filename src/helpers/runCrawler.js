const { runCore: crawler } = require("accessible-pipeline");
const urlRegex = require("./urlRegex");

async function runCrawler(site, crawlerConfig) {
  if (!urlRegex.test(site)) {
    throw new Error("Malformed url");
  }

  const url = new URL(site);
  const { results } = await crawler(url, crawlerConfig);
  return results;
}

module.exports = runCrawler;
