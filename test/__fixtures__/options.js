const program = [process.argv[0], process.argv[1]];

const siteOnlyOptions = {
  "--site": "https://foo.bar"
};

const allOptions = {
  ...siteOnlyOptions,
  "--output": "test/",
  "--limit": "5",
  "--filename": "res.json",
  "--num-retries": "1",
  "--ignore-fragment-links": "",
  "--ignore-extensions": "foo,bar",
  "--route-manifest": "mani.json",
  "--streaming": ""
};

function toArray(obj) {
  return Object.keys(obj)
    .map(k => [k, obj[k]])
    .filter(s => s.length > 0)
    .reduce((arr, curr) => [...arr, ...curr]);
}

module.exports = {
  program,
  siteOnlyOptions: toArray(siteOnlyOptions),
  allOptions: toArray(allOptions)
};
