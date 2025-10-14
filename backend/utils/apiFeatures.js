const screw = require("../models/screw")

class apiFeatures{
    constructor(query,queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    async search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        } : {}
        this.query = await this.query.find({...keyword})
        }
}


module.exports = apiFeatures