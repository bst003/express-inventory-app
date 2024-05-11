const cloudinary = require("cloudinary");
const cloudinaryConfig = require("../cloudinary.config");

const Cloudinary = (() => {
  const initConfig = () => {
    cloudinary.config({
      cloud_name: cloudinaryConfig.name,
      api_key: cloudinaryConfig.key,
      api_secret: cloudinaryConfig.secret,
    });
  };

  const uploadImage = async (imagePath) => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const configName = () => {
    return cloudinaryConfig.name;
  };

  return {
    initConfig,
    uploadImage,
    configName,
  };
})();

module.exports = Cloudinary;
