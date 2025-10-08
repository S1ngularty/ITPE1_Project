const Screw = require("../models/screw");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const upload = multer({ dest: "tmp_uploads/" });

const classify = async (request) => {
  if (!request.file) throw new Error("no file uploaded");
  const formData = new FormData();
  formData.append("file", fs.createReadStream(request.file.path));
  const imageBase64 = fs.readFileSync(request.file.path, {
    encoding: "base64",
  });

  const screwData = await axios.post(
    "https://serverless.roboflow.com/screw_classify-tnjdl/8",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
      params: {
        api_key: process.env.ROBOFLOW_API_KEY,
      },
    }
  );
  fs.unlink(request.file.path, () => {});

  const toFetchDocument = screwData.data.predicted_classes[0];
  // console.log("here ", toFetchDocument);

  const screwDocument = await Screw.find({
    name: toFetchDocument,
  }).exec();
  if (!screwDocument)
    throw new Error("Screw does not exist on the database collection");
  return screwDocument[0];
};

const count = async (request) => {
  if (!request.file) throw new Error("No Uploaded file");
  const imageBase64 = fs.readFileSync(request.file.path, {
    encoding: "base64",
  });
  const response = await axios.post(
    "https://serverless.roboflow.com/screw-kuuzp/2",
    imageBase64,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        api_key: process.env.ROBOFLOW_API_KEY,
        confidence: 0.2,
      },
    }
  );

  fs.unlink(request.file.path, () => {});

  if (!response) throw new Error("object doesnt exist");

  return response;
};

module.exports = { classify, count };
