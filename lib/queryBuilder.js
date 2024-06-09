class QueryBuilder {
    constructor(collection) {
        this.collection = collection;
        this.query = {};
        this.projection = {};
        this.sorting = {};
        this.limitValue = null;
        this.skipValue = null;
        this.pipeline = [];
    }

    static operatorMap = {
        '=': null,
        '!=': '$ne',
        '>': '$gt',
        '>=': '$gte',
        '<': '$lt',
        '<=': '$lte',
        'in': '$in',
        'nin': '$nin'
    };

    where(field, operator, value) {
        const mongoOperator = QueryBuilder.operatorMap[operator];
        if (mongoOperator === null) {
            this.query[field] = value;
        } else {
            if (!this.query[field]) {
                this.query[field] = {};
            }
            this.query[field][mongoOperator] = value;
        }
        console.log('where query:', this.query);
        return this;
    }
    orWhere(field, operator, value) {
        const mongoOperator = QueryBuilder.operatorMap[operator];
        console.log(`orWhere: field=${field}, operator=${operator}, mongoOperator=${mongoOperator}, value=${value}`);
        const condition = {};
        if (mongoOperator === null) {
            condition[field] = value;
        } else {
            condition[field] = { [mongoOperator]: value };
        }

        if (!this.query.$or) {
            const firstCondition = { ...this.query };
            console.log('firstCondition:', firstCondition);
            this.query = { $or: [firstCondition, condition] };
        } else {
            this.query.$or.push(condition);
        }

        console.log('orWhere query:', JSON.stringify(this.query, null, 2));
        return this;
    }

    select(fields) {
        fields.forEach(field => {
            this.projection[field] = 1;
        });
        return this;
    }

    orderBy(field, direction = 'asc') {
        this.sorting[field] = direction === 'asc' ? 1 : -1;
        return this;
    }

    limit(value) {
        this.limitValue = value;
        return this;
    }

    skip(value) {
        this.skipValue = value;
        return this;
    }

    join(collectionName, localField, foreignField, alias) {
        this.pipeline.push(
            { $lookup: { from: collectionName, localField: localField, foreignField: foreignField, as: alias } },
            { $unwind: `$${alias}` }
        );
        return this;
    }

    async get() {
        let cursor;
        if (this.pipeline.length > 0) {
            this.pipeline.unshift({ $match: this.query });
            if (Object.keys(this.projection).length > 0) {
                this.pipeline.push({ $project: this.projection });
            }
            if (Object.keys(this.sorting).length > 0) {
                this.pipeline.push({ $sort: this.sorting });
            }
            if (this.limitValue !== null) {
                this.pipeline.push({ $limit: this.limitValue });
            }
            if (this.skipValue !== null) {
                this.pipeline.push({ $skip: this.skipValue });
            }
            cursor = this.collection.aggregate(this.pipeline);
        } else {
            cursor = this.collection.find(this.query).project(this.projection).sort(this.sorting);
            if (this.limitValue !== null) {
                cursor = cursor.limit(this.limitValue);
            }
            if (this.skipValue !== null) {
                cursor = cursor.skip(this.skipValue);
            }
        }
        const results = await cursor.toArray();
        console.log('results:', results);
        return results;
    }
}

module.exports = QueryBuilder;
