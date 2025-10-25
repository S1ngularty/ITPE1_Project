const UploadAnalysis = require("../models/uploadAnalysis");
const { uploadToCloudinary, singleImage } = require("../utils/cloudinary");

const recentUploads = async (request) => {
  if (!request) throw new Error("no request found");
  const result = await UserActivity.create(request.body);
  if (!result) throw new Error("failed to save as recents");
};

const saveUploads = async (request) => {
  if (!request.body) throw new Error("empty request");
  const { activityID, name } = request.body;
  if (!activityID) throw new Error("screw ID is indefined");
  if (!name) throw new Error("name is indefined");

  console.log(activityID);
  const updateActivity = await UploadAnalysis.findById(activityID).exec();
  updateActivity.saveStatus = true;
  updateActivity.name = name;
  updateActivity.save();
  console.log(updateActivity);
  if (!updateActivity) throw new Error("Failed to save the analysis record");
  return updateActivity;
};

const fetchSaveAnalysis = async () => {
  const savedAnalysis = await UploadAnalysis.find({ saveStatus: true })
    .populate("user screw")
    .exec();
  if (savedAnalysis.length < 1) throw new Error("No saved analysis yet");
  return savedAnalysis;
};

const dashboardInfo = async (user) => {
  if (!user) throw new Error("user is undefined");

  const [history, requestUsage] = await Promise.all([
    UserActivity.find({ user: user.userId }).exec(),
    UserActivity.find({ user: user.userId }).countDocuments().exec(),
  ]);

  // console.log(history, requestUsage);
  let isSave = [];
  let notSave = [];

  for (let activity of history) {
    // console.log(activity)
    if (activity.saveStatus === true) {
      isSave.push(activity);
      continue;
    }
    notSave.push(activity);
  }

  return { activity: { isSave, notSave }, requestUsage };
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

module.exports = {
  saveUploads,
  fetchSaveAnalysis,
  dashboardInfo,
  editSaveAnalyses,
  unsavedAnalyses,
};
