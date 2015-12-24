// Require necessary modules
var XLSX = require('xlsx');
var XML_BUILDER = require('xmlbuilder');
var FS = require('fs');
var FS_UTILS = require('./fs-utils');


function toXml(inputFilePath, outputDirPath, stringNameKey) {
  var translations = readJson(inputFilePath);
  var xmlBuilders = jsonToXmlBuilders(translations, stringNameKey);
  writeXmlFiles(xmlBuilders, outputDirPath);
}


function readJson(inputFilePath) {
  var workbook = XLSX.readFile(inputFilePath);
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
}


function jsonToXmlBuilders(translations, stringNameKey) {
  var xmlBuilders = {};
  var numberOfTranslations = translations.length;

  for (var i = 0; i < numberOfTranslations; i++) {
    var translation = translations[i];
    var stringName = translation[stringNameKey];

    if (!stringName) {
      throw {
        type: "Malformed input",
        message: "Every row should have a valid value for the column '" + stringNameKey + "'"
      }
    }

    for (var languageName in translation) {

      if (!languageName) {
        throw {
          type: "Malformed input",
          message: "Language name can't be empty"
        }
      }

      if (languageName !== stringNameKey && translation.hasOwnProperty(languageName)) {
          var xmlBuilder = getXmlBuilder(languageName, xmlBuilders);
          xmlBuilder
              .element("string")
              .attribute("name", stringName)
              .raw(translation[languageName]);
      }
    }
  }

  return xmlBuilders;
}


function writeXmlFiles(xmlBuilders, outputDirPath) {
  FS_UTILS.createDirIfNotExists(outputDirPath);
  for (var languageName in xmlBuilders) {
    var xmlBuilder = xmlBuilders[languageName];
    FS.writeFileSync(
      outputDirPath + "/" + languageName + ".xml",
      xmlBuilder.end({ pretty: true})
    );
  }
}


function getXmlBuilder(forLanguage, xmlBuildersCache) {
  var xmlBuilder = xmlBuildersCache[forLanguage];

  // Create an xml builder if one doesn't exists for the given language
  if (!xmlBuilder) {
    xmlBuildersCache[forLanguage] = XML_BUILDER.create("resources");
    xmlBuilder = xmlBuildersCache[forLanguage];
  }

  return xmlBuilder;
}


module.exports = {
  toXml: toXml
};
