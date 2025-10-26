const SaveScrew = require("../models/saveScrew");

exports.saveScrew = async (request) => {
  if (!request.body) throw new Error("payload is undefined");
  const { screwId } = request.body;
  const { userId } = request.user;
  const userSaveExist = await SaveScrew.find({ user: userId }).exec();
  let result = null;
  if (userSaveExist.length<1) {
    const saved = await SaveScrew.create({
      user: userId,
      savedScrews: [{screwId}],
    });
    if (saved) result = saved;
  } else {
    userSaveExist[0].savedScrews.push({screwId});
    await userSaveExist[0].save();
    result = userSaveExist;
  }

  return result;
};
