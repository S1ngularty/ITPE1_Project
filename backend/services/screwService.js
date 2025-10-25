const Screw = require("../models/screw");
const { uploadToCloudinary } = require("../utils/cloudinary");
const apiFeatures = require("../utils/apiFeatures");

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

exports.getScrews = async (queryStr) => {
  const queryObject = new apiFeatures(Screw, queryStr);
  await queryObject.search();
  return queryObject.query;
};
exports.getSpecificScrew = async (request) => {
  if (!request.params) throw new Error("undefined parameter");
  const { screwId } = request.params;
  const result = await Screw.findById(screwId).exec();
  if (!result) throw new Error("screw does not exist on the database");
  return result;
};
