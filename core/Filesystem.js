const fs = require("fs");

const Filesystem = (() => {
  const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File removed: " + filePath);
      }
    });
  };

  return {
    deleteFile,
  };
})();

module.exports = Filesystem;
