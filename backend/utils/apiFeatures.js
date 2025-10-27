const screw = require("../models/screw");

class apiFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  async search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = await this.query.find({ ...keyword });
  }

  async filter() {
    let queryObj = { ...this.queryStr };

    const excludeFields = ["keyword", "page", "limit"];
    excludeFields.forEach((field) => delete queryObj[field]);

    Object.keys(queryObj).forEach((key) => {
      if (!queryObj[key]) delete queryObj[key];
    });

    this.query = this.query.find(queryObj);

    return this;
  }
}

module.exports = apiFeatures;
