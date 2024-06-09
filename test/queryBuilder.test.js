const { MongoClient, ObjectId } = require('mongodb');
const QueryBuilder = require('../lib/queryBuilder');

let client;
let db;
let collection;

beforeAll(async () => {
    client = await MongoClient.connect('mongodb://localhost:27017');
    db = client.db('test');
    collection = db.collection('testCollection');
    await collection.insertMany([
        { _id: new ObjectId(), name: 'John Doe', age: 30, city: 'New York' },
        { _id: new ObjectId(), name: 'Jane Doe', age: 25, city: 'Los Angeles' },
        { _id: new ObjectId(), name: 'Jack Doe', age: 35, city: 'Chicago' },
        { _id: new ObjectId(), name: 'Jill Doe', age: 28, city: 'San Francisco' },
    ]);
});

afterAll(async () => {
    await collection.drop();
    await client.close();
});

test('QueryBuilder can perform a simple query', async () => {
    const qb = new QueryBuilder(collection);
    const results = await qb.where('name', '=', 'John Doe').get();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('John Doe');
    expect(results[0].age).toBe(30);
    expect(results[0].city).toBe('New York');
});

test('QueryBuilder can perform an orWhere query', async () => {
    const qb = new QueryBuilder(collection);
    const results = await qb.where('age', '>', 30).orWhere('city', '=', 'Los Angeles').get();
    expect(results.length).toBe(2);
    const names = results.map(result => result.name);
    expect(names).toContain('Jane Doe');
    expect(names).toContain('Jack Doe');
});

test('QueryBuilder can perform a sorted query', async () => {
    const qb = new QueryBuilder(collection);
    const results = await qb.orderBy('age', 'desc').get();
    expect(results[0].age).toBe(35);
    expect(results[1].age).toBe(30);
});

test('QueryBuilder can perform a limited query', async () => {
    const qb = new QueryBuilder(collection);
    const results = await qb.limit(2).get();
    expect(results.length).toBe(2);
});

test('QueryBuilder can perform a skipped query', async () => {
    const qb = new QueryBuilder(collection);
    const results = await qb.skip(2).get();
    expect(results.length).toBe(2);
});

test('QueryBuilder can perform a join query', async () => {
    const ordersCollection = db.collection('orders');
    const users = await collection.find().toArray();
    await ordersCollection.insertMany([
        { user_id: users[0]._id, product: 'Product A' },
        { user_id: users[1]._id, product: 'Product B' },
    ]);

    const qb = new QueryBuilder(collection);
    const results = await qb.join('orders', '_id', 'user_id', 'orders').get();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('orders.product');
});
