const parseArguments = require("../src/helpers/parseArguments");
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
      crawlerConfig: {
        ignoreExtensions: ["foo", "bar"],
        streaming: true,
        pageLimit: 5,
        maxRetries: 1,
        ignoreFragmentLinks: true,
        routeManifestPath: "mani.json"
      }
    };

    const actual = parseArguments(argv);

    expect(actual).toEqual(expected);
  });

  it("parses with default values", () => {
    const argv = [...program, ...siteOnlyOptions];

    const expected = {
      site: "https://foo.bar",
      outputFilePath: "results/",
      outputFileName: "report.json",
      crawlerConfig: {
        pageLimit: 1000000,
        maxRetries: 5,
        ignoreFragmentLinks: undefined,
        ignoreExtensions: undefined,
        routeManifestPath: undefined,
        streaming: undefined
      }
    };

    const actual = parseArguments(argv);

    expect(actual).toEqual(expected);
  });
});
