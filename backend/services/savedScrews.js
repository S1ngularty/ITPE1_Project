const SaveScrew = require("../models/saveScrew");

exports.saveScrew = async (request) => {
  if (!request.body) throw new Error("payload is undefined");
  const { screwId } = request.body;
  const { userId } = request.user;
  const userSaveExist = await SaveScrew.find({ user: userId }).exec();
  let result = null;
  if (userSaveExist.length < 1) {
    const saved = await SaveScrew.create({
      user: userId,
      savedScrews: [{ screwId }],
    });
    if (saved) result = saved;
  } else {
    userSaveExist[0].savedScrews.push({ screwId });
    await userSaveExist[0].save();
    result = userSaveExist;
  }

  return result;
};

exports.removeToLikes = async (request) => {
  if (!request.body) throw new Error("undefined payload");
  const { userId } = request.user;
  const { screwId } = request.body;
  const toRemove = await SaveScrew.find({ user: userId }).exec();
  if (!toRemove) throw new Error("failed to find the user document");
  console.log(toRemove[0]);

  const filtered = toRemove[0].savedScrews.filter((screw) =>
    !screw.screwId.equals(screwId)
  );

  console.log("filtered", filtered);
  toRemove[0].savedScrews = filtered;
  toRemove[0].save();
  return toRemove;
};
