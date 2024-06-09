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
        return this;
    }
    orWhere(field, operator, value) {
        const mongoOperator = QueryBuilder.operatorMap[operator];
        const condition = {};
        if (mongoOperator === null) {
            condition[field] = value;
        } else {
            condition[field] = { [mongoOperator]: value };
        }

        if (!this.query.$or) {
            const firstCondition = { ...this.query };
            this.query = { $or: [firstCondition, condition] };
        } else {
            this.query.$or.push(condition);
        }
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
        try {
            let cursor;
            let results;

            if (this.pipeline.length > 0) {
                cursor = await this.collection.aggregate(this.pipeline);
            } else {

                cursor = this.collection.find(this.query);

                if (Object.keys(this.projection).length > 0) {
                    cursor = cursor.project(this.projection);
                }

                if (Object.keys(this.sorting).length > 0) {
                    cursor = cursor.sort(this.sorting);
                }
                if (this.limitValue !== null) {
                    cursor = cursor.limit(this.limitValue);
                }
                if (this.skipValue !== null) {
                    cursor = cursor.skip(this.skipValue);
                }
            }
            if (typeof cursor.toArray === 'function') {
                results = await cursor.toArray();
            } else {
                results = await cursor;
            }
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = QueryBuilder;
