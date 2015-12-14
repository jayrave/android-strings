// Require necessary modules
var FS = require('fs');

function createDirIfNotExists(dirPath) {
  try {
    var stat = FS.statSync(dirPath);
    if (!stat.isDirectory()) {
      throw {
        type: "IO Exception",
        message: "\"" + dirPath + "\" is not a directory"
      };
    }
  } catch (err) {
    // Error is usually thrown if the file doesn't exists
    FS.mkdirSync(dirPath);
  }
}


module.exports = {
  createDirIfNotExists: createDirIfNotExists
};
