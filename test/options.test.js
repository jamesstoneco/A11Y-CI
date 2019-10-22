const { parseCLIArguments } = require("../src/helpers/parseCLIArguments");
const {
  program,
  allOptions,
  siteOnlyOptions
} = require("./__fixtures__/options");

jest.mock("accessible-pipeline", () => ({ runCore: jest.fn() }));

describe("should parse options correctly", () => {
  it("parses all options correctly", () => {
    const argv = [...program, ...allOptions];

    const expected = {
      site: "https://foo.bar",
      outputFilePath: "test/",
      outputFileName: "res.json",
      errorAverageThreshold: 5,
      crawlerConfig: {
        ignoreExtensions: ["foo", "bar"],
        streaming: true,
        pageLimit: 5,
        maxRetries: 1,
        ignoreFragmentLinks: true,
        routeManifestPath: "mani.json"
      }
    };

    const actual = parseCLIArguments(argv);

    expect(actual).toEqual(expected);
  });

  it("parses with default values", () => {
    const argv = [...program, ...siteOnlyOptions];

    const expected = {
      site: "https://foo.bar",
      outputFilePath: "results/",
      outputFileName: "report.json",
      errorAverageThreshold: 5,
      crawlerConfig: {
        pageLimit: 1000000,
        maxRetries: 5,
        ignoreFragmentLinks: undefined,
        ignoreExtensions: undefined,
        routeManifestPath: undefined,
        streaming: undefined
      }
    };

    const actual = parseCLIArguments(argv);

    expect(actual).toEqual(expected);
  });
});
