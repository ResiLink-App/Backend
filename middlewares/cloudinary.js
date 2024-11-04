const cloudinary = require("cloudinary").v2;

function cloudinaryUserPfpUploader(imagePath, callback) {
  cloudinary.uploader.upload(
    imagePath,
    { folder: "resilink/users/pfps" },
    function (error, result) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    }
  );
}

function cloudinaryListingUploader(media, callback) {
  const uploadedMedia = {
    images: [],
    video: ""
  };

  let completedCount = 0;
  const totalFiles = media.images.length + (media.video ? 1 : 0);

  // Upload images
  media.images.forEach((image, index) => {
    cloudinary.uploader.upload(
      image.path,
      { folder: "resilink/prop/images", resource_type: "image" },
      function (error, result) {
        completedCount++;
        if (error) {
          callback(error, null);
          return;
        }
        uploadedMedia.images[index] = result.secure_url;

        // Check if all media have been uploaded
        if (completedCount === totalFiles) {
          callback(null, uploadedMedia);
        }
      }
    );
  });

  // Upload video if provided
  if (media.video) {
    cloudinary.uploader.upload(
      media.video.path,
      { folder: "resilink/prop/videos", resource_type: "video" },
      function (error, result) {
        completedCount++;
        if (error) {
          callback(error, null);
          return;
        }
        uploadedMedia.video = result.secure_url;

        if (completedCount === totalFiles) {
          callback(null, uploadedMedia);
        }
      }
    );
  }
}


module.exports = { cloudinaryUserPfpUploader, cloudinaryListingUploader };
