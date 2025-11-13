const User = require("../models/user");
const Screw = require("../models/screw");
const UploadAnalysis = require("../models/uploadAnalysis");
const axios = require("axios");

exports.dashboard = async (request) => {
  try {
    const [cloudinaryUsage, roboflowUsage, requestUsage, userGrowth] =
      await Promise.all([
        // --- CLOUDINARY USAGE ---
        axios.get(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/usage`,
          {
            auth: {
              username: process.env.CLOUDINARY_API_KEY,
              password: process.env.CLOUDINARY_API_SECRET,
            },
          }
        ),

        // --- ROBOFLOW USAGE ---
        axios.get(`https://api.roboflow.com/singularity-rdlzv/stats`, {
          params: {
            api_key: process.env.ROBOFLOW_API_KEY,
            startDate: "2025-10-01",
            endDate: "2025-10-27",
          },
        }),

        // --- REQUEST USAGE ---
        UploadAnalysis.aggregate([
          {
            $match: {
              createdAt: { $ne: null },
              typeOfService: { $in: ["classification", "count"] },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              classificationCount: {
                $sum: {
                  $cond: [{ $eq: ["$typeOfService", "classification"] }, 1, 0],
                },
              },
              countCount: {
                $sum: {
                  $cond: [{ $eq: ["$typeOfService", "count"] }, 1, 0],
                },
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              classificationCount: 1,
              countCount: 1,
            },
          },
        ]),
        User.aggregate([
          {
            $match: {
              createdAt: { $ne: null },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              userCount: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $project: {
              _id: 0,
              year: "$_id.year",
              month: "$_id.month",
              userCount: 1,
            },
          },
        ]),
      ]);

    // console.log("requestUsage:", requestUsage);
    // console.log("userGrowth:", userGrowth);

    return {
      cloudinaryUsage: cloudinaryUsage.data,
      roboflowUsage: roboflowUsage.data,
      requestUsage,
      userGrowth,
    };
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    throw error;
  }
};
