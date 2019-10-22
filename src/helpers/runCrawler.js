const { runCore: crawler } = require("accessible-pipeline");
const { isURL } = require("./isURL");

async function runCrawler(site, crawlerConfig) {
  if (!isURL(site)) {
    throw new Error("Malformed url");
  }

  const url = new URL(site);
  const { results } = await crawler(url, crawlerConfig);
  return results;
}

module.exports = { runCrawler };
