const UploadAnalysis = require("../models/uploadAnalysis");
const User = require("../models/user")
const { uploadToCloudinary, singleImage } = require("../utils/cloudinary");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const fs = require("fs");

const recentUploads = async (request) => {
  if (!request) throw new Error("no request found");
  const result = await UploadAnalysis.create(request.body);
  if (!result) throw new Error("failed to save as recents");
};

const saveUploads = async (request) => {
  if (!request.body) throw new Error("empty request");
  const { activityID, name } = request.body;
  if (!activityID) throw new Error("screw ID is undefined");
  if (!name) throw new Error("name is undefined");

  console.log(activityID);
  const updateActivity = await UploadAnalysis.findById(activityID).exec();
  updateActivity.saveStatus = true;
  updateActivity.name = name;
  updateActivity.save();
  console.log(updateActivity);
  if (!updateActivity) throw new Error("Failed to save the analysis record");
  return updateActivity;
};

const fetchSaveAnalysis = async (request) => {
  const { userId } = request.user;
  const savedAnalysis = await UploadAnalysis.find({
    saveStatus: true,
    user: userId,
  })
    .populate("user screw")
    .exec();
  if (savedAnalysis.length < 1) throw new Error("No saved analysis yet");
  return savedAnalysis;
};

const dashboardInfo = async (user) => {
  if (!user) throw new Error("user is undefined");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [history, requestUsage, graphData,userCount] = await Promise.all([
    UploadAnalysis.find({ user: user.userId }).exec(),
    UploadAnalysis.countDocuments({
      user: user.userId,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    }).exec(),
    UploadAnalysis.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(user.userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            service: "$typeOfService",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          service: {
            $push: {
              k: "$_id.service",
              v: "$count",
            },
          },
        },
      },
      {
        $addFields: {
          service: { $arrayToObject: "$service" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    User.find().countDocuments().exec()
  ]);

  // console.log(graphData);
  // console.log(history, requestUsage);
  let isSave = [];
  let notSave = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let i = 0;
  let graphDataUsage = months.map((month, index) => {
    if (i < graphData.length && graphData[i]._id.month - 1 === index) {
      let temp = {
        month,
        classification: graphData[i].service.classification || 0,
        count: graphData[i].service.count || 0,
      };
      i++;
      return temp;
    }

    return {
      month,
      classification: 0,
      count: 0,
    };
  });

  for (let activity of history) {
    // console.log(activity)
    if (activity.saveStatus === true) {
      isSave.push(activity);
      continue;
    }
    notSave.push(activity);
  }
  return { activity: { isSave, notSave }, requestUsage, graphDataUsage, requestLimit:(Math.floor(2000/userCount)) };
};

const editSaveAnalyses = async (request) => {
  const recordId = request.params.analysesRecordId;
  const { userId } = request.user;
  const { analysesName } = request.body;

  const findRecord = await UploadAnalysis.findById(recordId).exec();
  if (!findRecord) throw new Error("cannot find the record on the collection");
  if (analysesName) findRecord.name = analysesName;
  await findRecord.save();

  return findRecord;
};

const unsavedAnalyses = async (request) => {
  const { analysesRecordId } = request.body;
  if (!analysesRecordId) throw new Error("undefined record id");
  const record = await UploadAnalysis.findById(analysesRecordId).exec();
  if (!record) throw new Error("failed to find the record in the collection");
  record.saveStatus = false;
  await record.save();
  return record;
};

const downloadAnalysis = async (request, download) => {
  const { result, storeRecent, mode } = request.body;
  console.log(mode);

  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
    info: {
      Title: `Screw Analysis Report - ${storeRecent.name}`,
      Author: "ScrewIT System",
      Subject:
        mode === "classify"
          ? "Screw Classification Analysis"
          : "Screw Counting Analysis",
    },
  });

  const filename = `${storeRecent.name.replace(
    /\s+/g,
    "_"
  )}_analysis_report.pdf`;
  const filePath = `./uploads/reports/${filename}`;

  // Create folder if not exists
  if (!fs.existsSync("./uploads/reports")) {
    fs.mkdirSync("./uploads/reports", { recursive: true });
  }

  // Colors
  const primaryColor = "#2c3e50";
  const secondaryColor = "#3498db";
  const accentColor = "#e74c3c";
  const lightGray = "#f8f9fa";
  const borderColor = "#dee2e6";
  const darkGray = "#7f8c8d";

  // Pipe to file
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Header with background
  doc.rect(0, 0, doc.page.width, 100).fill(primaryColor);

  doc
    .fillColor("#ffffff")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(
      mode === "classify"
        ? "SCREW CLASSIFICATION REPORT"
        : "SCREW COUNTING REPORT",
      50,
      40,
      { align: "center" }
    )
    .fontSize(10)
    .font("Helvetica")
    .text(
      mode === "classify"
        ? "Comprehensive Classification Analysis"
        : "Screw Counting Analysis",
      50,
      70,
      { align: "center" }
    );

  // Analysis info section
  const sectionStartY = 130;
  doc.y = sectionStartY;

  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("ANALYSIS INFORMATION", 50, doc.y)
    .moveDown(0.3);

  // Info box with background
  const infoBoxY = doc.y;
  doc
    .rect(50, infoBoxY, doc.page.width - 100, 80)
    .fill(lightGray)
    .stroke(borderColor);

  doc
    .fillColor(primaryColor)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Analysis Name:", 60, infoBoxY + 15)
    .text("Type of Service:", 60, infoBoxY + 35)
    .text("Date:", 60, infoBoxY + 55)
    .text("User ID:", 300, infoBoxY + 15);

  doc
    .fillColor(darkGray)
    .font("Helvetica")
    .text(storeRecent.name, 140, infoBoxY + 15)
    .text(storeRecent.typeOfService, 140, infoBoxY + 35)
    .text(new Date(storeRecent.createdAt).toLocaleString(), 140, infoBoxY + 55)
    .text(storeRecent.user, 340, infoBoxY + 15);

  doc.y = infoBoxY + 90;

  // Image section
  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("ANALYZED IMAGE", 50, doc.y)
    .moveDown(0.3);

  const imageUrl = storeRecent.uploadedImage?.url;
  console.log(imageUrl)
  if (imageUrl) {
    try {
      // Download the image temporarily
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      // console.log(response.data)
      const tempImg = `./uploads/temp-image-${Date.now()}.jpg`;
      fs.writeFileSync(tempImg, Buffer.from(response.data));

      // Image with border
      const imageY = doc.y;
      doc.rect(50, imageY, doc.page.width - 100, 200).stroke(borderColor);

      doc.image(tempImg, 55, imageY + 5, {
        fit: [doc.page.width - 110, 190],
        align: "center",
      });

      fs.unlinkSync(tempImg);
      doc.y = imageY + 210;
    } catch (error) {
      console.error("Error loading image:", error);
      doc
        .fillColor(accentColor)
        .text("Image not available", 50, doc.y)
        .moveDown(0.5);
    }
  }

  // Conditional content based on mode
  if (mode === "classify") {
    // CLASSIFICATION MODE CONTENT
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("SCREW DETAILS", 50, doc.y)
      .moveDown(0.3);

    // Details table
    const detailsY = doc.y;
    const detailsHeight = 120;

    doc
      .rect(50, detailsY, doc.page.width - 100, detailsHeight)
      .fill(lightGray)
      .stroke(borderColor);

    // Column 1
    doc
      .fillColor(primaryColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Name:", 60, detailsY + 15)
      .text("Category:", 60, detailsY + 35)
      .text("Material:", 60, detailsY + 55)
      .text("Strength:", 60, detailsY + 75)
      .text("Sizes:", 60, detailsY + 95);

      // console.log("result stage",result)
    doc
      .fillColor(darkGray)
      .font("Helvetica")
      .text(result.name || "N/A", 120, detailsY + 15)
      .text(result.category || "N/A", 120, detailsY + 35)
      .text(result.material || "N/A", 120, detailsY + 55)
      .text(result.strength || "N/A", 120, detailsY + 75)
      .text(result.sizes?.join(", ") || "N/A", 120, detailsY + 95, {
        width: doc.page.width - 140,
      });

    doc.y = detailsY + detailsHeight + 20;

    // Description section
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("DESCRIPTION", 50, doc.y)
      .moveDown(0.3);

    // Description box
    const descY = doc.y;
    const descHeight = 120;

    doc
      .rect(50, descY, doc.page.width - 100, descHeight)
      .fill(lightGray)
      .stroke(borderColor);

    doc
      .fillColor(darkGray)
      .fontSize(10)
      .font("Helvetica")
      .text(result.description || "No description available.", 60, descY + 15, {
        width: doc.page.width - 120,
        align: "justify",
      });
  } else if (mode === "count") {
    // COUNTING MODE CONTENT
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("COUNTING RESULTS", 50, doc.y)
      .moveDown(0.3);

    // Counting results box
    const countY = doc.y;
    const countHeight = 100;

    doc
      .rect(50, countY, doc.page.width - 100, countHeight)
      .fill(lightGray)
      .stroke(borderColor);

    // Main count result
    doc
      .fillColor(primaryColor)
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(storeRecent.count || "0 screws detected", 0, countY + 30, {
        align: "center",
        width: doc.page.width,
      });

    // Additional counting information
    doc
      .fillColor(darkGray)
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Analysis Type: ${"Screw Counting"}`,
        0,
        countY + 70,
        {
          align: "center",
          width: doc.page.width,
        }
      );

    doc.y = countY + countHeight + 30;

    // Counting summary section
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("ANALYSIS SUMMARY", 50, doc.y)
      .moveDown(0.3);

    const summaryY = doc.y;
    const summaryHeight = 80;

    doc
      .rect(50, summaryY, doc.page.width - 100, summaryHeight)
      .fill(lightGray)
      .stroke(borderColor);

    doc
      .fillColor(darkGray)
      .fontSize(10)
      .font("Helvetica")
      .text(
        "This analysis used computer vision to detect and count screws in the uploaded image. The system identified individual screw instances and provided the total count.",
        60,
        summaryY + 15,
        {
          width: doc.page.width - 120,
          align: "justify",
        }
      )
      .text(
        `Analysis completed on: ${new Date(
          storeRecent.createdAt
        ).toLocaleString()}`,
        60,
        summaryY + 50,
        {
          width: doc.page.width - 120,
        }
      );
  }

  // Footer
  const footerY = doc.page.height - 50;
  doc
    .fillColor(primaryColor)
    .fontSize(8)
    .text("Generated by ScrewIT System (Local School Project)", 50, footerY, {
      align: "center",
    })
    .text(
      `Page 1 of 1 • Generated on ${new Date().toLocaleString()}`,
      50,
      footerY + 15,
      {
        align: "center",
      }
    );

  doc.end();

  writeStream.on("finish", () => {
    // console.log("downloading.....",filename,filePath)
    download(filePath, filename);
  });

  writeStream.on("error", (error) => {
    console.error("Error generating PDF:", error);
    throw new Error("failed to write the file")
  });
};

const RecentAnalysis = async (request) => {
  const { limit } = request.query || null;
  const recent = await UploadAnalysis.find({ user: request.user.userId })
    .limit(limit || 0).populate("screw user")
    .sort({ createdAt: -1 });
  // console.log(recent);
  return recent;
};

module.exports = {
  saveUploads,
  fetchSaveAnalysis,
  dashboardInfo,
  editSaveAnalyses,
  unsavedAnalyses,
  downloadAnalysis,
  RecentAnalysis,
};
