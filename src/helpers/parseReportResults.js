function normalise(inputData) {
  if (typeof inputData === "object") {
    return JSON.parse(JSON.stringify(inputData));
  }

  return JSON.parse(inputData);
}

function getViolations(data) {
  return data
    .map(item => {
      if (!item.violations || item.violations.length <= 0) return null;
      const { url, violations } = item;
      return {
        url,
        violations
      };
    })
    .filter(Boolean);
}

function reportParser(inputData) {
  const normalisedData = normalise(inputData);
  return getViolations(normalisedData);
}

module.exports = reportParser;
