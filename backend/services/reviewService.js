const Review = require("../models/review");

exports.list = async () => {
  const result = await Review.find()
    .populate("user")
    .populate("analysis")
    .exec();
  return result;
};

exports.create = async (request) => {
  // console.log(request.body)
  if (!request.body) throw new Error("undefined request body");
  request.body.data.user = request.user.userId;
  const newReview = await Review.create(request.body.data);
  if (!newReview) throw new Error("failed to create the review");
  return newReview;
};
