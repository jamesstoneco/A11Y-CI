const { runCore: crawler } = require("accessible-pipeline");
const isUrl = require("./isUrl");

async function runCrawler(site, crawlerConfig) {
  if (!isUrl(site)) {
    throw new Error("Malformed url");
  }

  const url = new URL(site);
  const { results } = await crawler(url, crawlerConfig);
  return results;
}

module.exports = runCrawler;
