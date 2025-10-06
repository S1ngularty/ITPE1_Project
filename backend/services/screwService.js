const Screw = require("../models/screw");
const { uploadToCloudinary } = require("./cloudinary");

exports.createScrew = async (body, files) => {
  if (!body) throw new Error("request body is undentified");
  let images = [];
  await Promise.all(files.map((file) => uploadToCloudinary(file.buffer))).then(
    (response) => {
      response.forEach((image) => {
        images.push({ public_id: image.public_id, url: image.url });
      });
    }
  );

  body.images = images;
  const newScrew = await Screw.create(body);
  if (!newScrew) throw new Error("failed to create the screw");
  return newScrew;
};
