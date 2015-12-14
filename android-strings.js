var STRING_NAME_KEY = "string name";

function toXml(inputFilePath, outputDirPath) {
  require('./to-xml').toXml(inputFilePath, outputDirPath, STRING_NAME_KEY);
}

module.exports = {
  toXml: toXml
};
