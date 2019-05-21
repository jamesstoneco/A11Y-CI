const assert = require("assert");
const { parseArguments } = require("../app");

jest.mock("accessible-pipeline", () => ({ runCore: jest.fn() }));

describe("should parse options correctly", () => {
  it("parses some options", () => {
    const argv = [
      process.argv[0],
      process.argv[1],
      "-s",
      "https://foo.bar",
      "-o",
      "test/",
      "-l",
      "5",
      "-f",
      "res.json",
      "-n",
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

    const actual = parseArguments(argv);

    assert.deepStrictEqual(actual, expected);
  });

  it("parses with default values", () => {
    const argv = [process.argv[0], process.argv[1], "-s", "https://foo.bar"];

    const expected = {
      site: "https://foo.bar",
      outputFilePath: "results/",
      outputFileName: "report.json",
      crawlerConfig: {
        pageLimit: 1000000,
        maxRetries: 5
      }
    };

    const actual = parseArguments(argv);

    assert.deepStrictEqual(actual, expected);
  });
});
