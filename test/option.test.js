const assert = require("assert");
const { parseArguments } = require("../app");

jest.mock("accessible-pipeline", () => ({ runCore: jest.fn() }));

describe("should parse options correctly", () => {
  it("parses some options", () => {
    const argv = [
      process.argv[0],
      process.argv[1],
      "--site",
      "https://foo.bar",
      "--output",
      "test/",
      "--limit",
      "5",
      "--filename",
      "res.json",
      "--num-retries",
      "1",
      "--ignore-fragment-links",
      "--ignore-extensions",
      "foo,bar",
      "--route-manifest",
      "mani.json",
      "--streaming"
    ];

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

    const actual = parseArguments(argv, require("commander"));

    assert.deepEqual(actual, expected);
  });

  it("parses with default values", () => {
    const argv = [
      process.argv[0],
      process.argv[1],
      "--site",
      "https://foo.bar"
    ];

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

    const actual = parseArguments(argv, require("commander"));

    assert.deepEqual(actual, expected);
  });
});
