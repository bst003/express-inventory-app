const multer = require("multer");

const Multer = (() => {
  const _diskStorageConfig = {
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      console.log(file);
      const fileExt = file.mimetype.split("/")[1];

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt);
    },
  };

  const _storage = multer.diskStorage(_diskStorageConfig);

  const upload = multer({ storage: _storage });

  return {
    upload,
  };
})();

module.exports = Multer;
