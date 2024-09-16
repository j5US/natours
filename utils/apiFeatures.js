// 08 video 101
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 08 video 95
        // Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        // this will delete the above properties from query parameters
        excludedFields.forEach((el) => delete queryObj[el]);

        // 08 video 96
        // Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matches) => `$${matches}`);

        // returns a query
        // let query = Tour.find(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        // 08 video 97
        // Sorting
        if (this.queryString.sort) {
            const sortby = this.queryString.sort.split(",").join(" ");

            this.query = this.query.sort(sortby);
        } else {
            // a bug
            // affects pagination funtionality -
            // because documents have the same time stamp
            // this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        // 08 video 98
        // Limiting Fields returned as response
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");

            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        // 08 video 99 - Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        // page=3&limit=10; 1-10 = page 1, 11-20 = page 2, 21-30 = page3
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
module.exports = APIFeatures;
