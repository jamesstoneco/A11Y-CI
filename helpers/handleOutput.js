const {
  promises: { open, writeFile, mkdir },
  existsSync
} = require("fs");
const mkdirp = require("mkdirp");

module.exports = async function handleOutput(results, outputPath, fileName) {
  const currentWorkingDirectory = process.cwd().replace(/\/$/, "");
  const pathForOutputFile = outputPath.replace(/\/$/, "");
  try {
    if (!existsSync(outputPath)) await mkdirp(outputPath);
    await writeFile(
      `${currentWorkingDirectory}/${outputPath}/${fileName}`,
      results
    );
  } catch (e) {
    throw new Error(e);
  }
};
