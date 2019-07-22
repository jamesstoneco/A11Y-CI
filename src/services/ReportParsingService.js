module.exports = class ReportParsingService {
  constructor() {
    this.normalise = this.normalise.bind(this);
    this.getViolations = this.getViolations.bind(this);
    this.parse = this.parse.bind(this);
  }

  normalise(inputData) {
    if (typeof inputData === "object") {
      return JSON.parse(JSON.stringify(inputData));
    }

    return JSON.parse(inputData);
  }

  getViolations(normalisedData) {
    return normalisedData
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

  parse(inputData) {
    const normalisedData = this.normalise(inputData);
    return this.getViolations(normalisedData);
  }
};
