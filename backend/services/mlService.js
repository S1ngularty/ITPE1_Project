const Screw = require("../models/screw");
const User = require("../models/user");
const UploadAnalysis = require("../models/uploadAnalysis");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
// const puter = require("@heyputer/puter.js");
const { init } = require("@heyputer/puter.js/src/init.cjs");
const { singleImage } = require("../utils/cloudinary");

const upload = multer({ dest: "tmp_uploads/" });

// async function userLimit(user) {
//   const userCount = await User.find().countDocuments().exec();
//   const userRequest = await User.find({
//     user: user.userId,
//   }).countDocuments.exec();
//   const requestLimit = Math.floor(2000 / userCount);
//     console.log(userCount,userRequest,requestLimit)

//   if (userRequest >= requestLimit) return false;
//   return true;
// }

const classify = async (request) => {
  if (!request.file) throw new Error("no file uploaded");

//  if(!await userLimit(request.user)) throw new Error("request limit has been reached")

  const formData = new FormData();
  formData.append("file", fs.createReadStream(request.file.path));
  const imageBase64 = fs.readFileSync(request.file.path, {
    encoding: "base64",
  });

  const screwData = await axios.post(
    "https://serverless.roboflow.com/screw_classify-tnjdl/9",
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

  const toFetchDocument = screwData.data.predicted_classes[0];
  if (!toFetchDocument) throw new Error("failed to classify the object");
  console.log("here ", toFetchDocument);

  const screwDocument = await Screw.find({
    name: toFetchDocument,
  }).exec();

  if (screwDocument.length < 1)
    throw new Error("Screw does not exist on the database collection");

  const upload = await singleImage(request.file);

  const storeRecent = await UploadAnalysis.create({
    user: request.user.userId,
    screw: screwDocument[0]._id.toString(),
    typeOfService: "classification",
    uploadedImage: {
      url: upload.url,
      public_id: upload.public_id,
    },
  });
  if (!storeRecent)
    throw new Error("failed to store in recent activity of user");
  fs.unlink(request.file.path, () => {});
  return { screwDocument: screwDocument[0], storeRecent };
};

const count = async (request) => {
  const puter = init(process.env.PUTER_AUTH_TOKEN);

  //  if(!await userLimit(request.user)) throw new Error("request limit has been reached")

  if (!request.file) throw new Error("No uploaded file");

  const upload = await singleImage(request.file);
  const imageUrl = upload.url;
  console.log(imageUrl);
  // Use GPT model to count objects using the image URL
  const objectCountResponse = await puter.ai.chat(
    `Analyze this image thoroughly, now i want you to count all the fasteners. check the color pixel for each fasteners to make it distinct to other fasteners and to be more accurate. return a number of fasteners only.`,
    imageUrl,
    { model: "gpt-5-nano" }
  );
  console.log("result from puter:", objectCountResponse);
  // objectCountResponse is usually an object with `.message.content`
  const objectCount = objectCountResponse.message.content.trim();

  const storeRecent = await UploadAnalysis.create({
    user: request.user.userId,
    typeOfService: "count",
    uploadedImage: {
      url: upload.url,
      public_id: upload.public_id,
    },
    count: objectCount,
  });

  fs.unlink(request.file.path, () => {});

  return { objectCount, storeRecent };
};

// const count = async (request) => {
//   if (!request.file) throw new Error("No Uploaded file");
//   const imageBase64 = fs.readFileSync(request.file.path, {
//     encoding: "base64",
//   });
//   const response = await axios.post(
//     "https://serverless.roboflow.com/screw-kuuzp/2",
//     imageBase64,
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       params: {
//         api_key: process.env.ROBOFLOW_API_KEY,
//         confidence: 0.2,
//       },
//     }
//   );
//   // console.log(response.data)
//   if (!response) throw new Error("object doesnt exist");

//   const upload = await singleImage(request.file);

//   const storeRecent = await UploadAnalysis.create({
//     user: request.user.userId,
//     typeOfService: "count",
//     uploadedImage: {
//       url: upload.url,
//       public_id: upload.public_id,
//     },
//   });
//   fs.unlink(request.file.path, () => {});
//   // console.log(storeRecent)
//   if (!storeRecent)
//     throw new Error("failed to store in recent activity of user");
//   return { response, storeRecent };
// };

module.exports = { classify, count };
