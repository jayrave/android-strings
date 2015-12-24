// Require necessary modules
var FS = require('fs')
var XML2JS = require('xml2js');
var XLSX_WRITE_STREAM = require('xlsx-writestream');
var FS_UTILS = require('./fs-utils');


function fromXml(filenames, outputDirPath, outputFileName, stringNameKey) {
  if (!Array.isArray(filenames) || filenames.length == 1) {
    throw {
      type: "Malformed input",
      message: "Please pass in an array with at least 2 filenames"
    }

  } else {
    var stringsWithoutKeyMap = {};

    var length = filenames.length;
    for (var i = 0; i < length; i++) {
      parseStringsXmlFile(filenames[i], stringsWithoutKeyMap, filenames);
    }

    var stringsWithKey = convertMapToStringsWithKey(stringsWithoutKeyMap, stringNameKey);
    writeSpreadsheet(stringsWithKey, outputDirPath, outputFileName);
  }
}


function parseStringsXmlFile(filename, stringsWithoutKeyMap, filenames) {
  var parser = new XML2JS.Parser({async: false});

  var strings;
  var data = FS.readFileSync(filename);
  parser.parseString(data, function (err, result) {
    strings = result.resources.string;
  });

  if (!strings) {
    throw {
      name: "Malformed input",
      message: "Make sure that all the strings are inside a <resources> tag"
    }

  } else {
    var stringsLength = strings.length;
    for (var i = 0; i < stringsLength; i++) {
      var string = strings[i];
      var stringName = string['$'].name;
      var stringValue = string['_'];

      if (!stringName || !stringValue) {
        throw {
          name: "Malformed input",
          message: "Make sure every string has a name and a valid value"
        };

      } else {
        var stringWithoutKey = getStringWithoutKeyObject(
          stringsWithoutKeyMap, stringName, filenames
        );

        stringWithoutKey[filename] = stringValue;
      }
    }
  }
}


function getStringWithoutKeyObject(map, stringName, filenames) {
  var stringWithoutKey = map[stringName];
  if (!stringWithoutKey) {
    map[stringName] = createDefaultStringWithoutKeyObject(filenames);
    stringWithoutKey = map[stringName];
  }

  return stringWithoutKey;
}


function createDefaultStringWithoutKeyObject(filenames) {
  var defaultObject = {};
  var length = filenames.length;
  for (var i = 0; i < length; i++) {
    defaultObject[filenames[i]] = "";
  }

  return defaultObject;
}


function convertMapToStringsWithKey(stringsMap, stringNameKey) {
  var stringsWithKey = [];
  for (var stringName in stringsMap) {
    if (stringsMap.hasOwnProperty(stringName)) {
      var stringsWithoutKey = stringsMap[stringName];
      stringsWithoutKey[stringNameKey] = stringName;

      // Now stringsWithoutKey object has the string key in it
      stringsWithKey.push(stringsWithoutKey);
    }
  }

  return stringsWithKey;
}


function writeSpreadsheet(stringsWithKey, outputDirPath, outputFileName) {
  FS_UTILS.createDirIfNotExists(outputDirPath);
  var filePathWithExtn = outputDirPath + "/" + outputFileName + ".xlsx";

  XLSX_WRITE_STREAM.write(filePathWithExtn, stringsWithKey, function (err) {
    console.log(JSON.stringify(err));
  });
}


module.exports = {
  fromXml: fromXml
};
