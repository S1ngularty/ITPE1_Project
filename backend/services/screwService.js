const Screw = require("../models/screw");
const SavedScrew = require("../models/saveScrew");
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
  let isSaved = false;

  const screw = await Screw.findById(screwId).exec();
  if (!screw) throw new Error("screw does not exist on the database");

  let getSave = null;
  if (request.user !== null) {
    getSave = await SavedScrew.find({ user: request.user.userId }).exec();

    for (let item of getSave[0].savedScrews) {
      if (screw._id.equals(item.screwId)) isSaved = true;
    }
  }

  const result = { screw, isSaved };

  return result;
};

exports.getOptions = async () => {
  const screwOptions = await Screw.find({})
    .select("category material threadedType driverType -_id")
    .exec();
  if (!screwOptions) throw new Error("failed to get the data options");

  let material = new Set(),
    category = new Set(),
    threadedType = new Set(),
    driverType = new Set();

  for (let obj of screwOptions) {
    if (obj.material) material.add(obj.material);
    if (obj.category) category.add(obj.category);
    if (obj.threadedType) threadedType.add(obj.threadedType);
    if (obj.driverType) driverType.add(obj.driverType);
  }

  return {
    material: [...material],
    category: [...category],
    threadedType: [...threadedType],
    driverType: [...driverType],
  };
};
