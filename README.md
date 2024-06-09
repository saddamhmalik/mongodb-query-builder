# MongoDB Query Builder

The MongoDB Query Builder is a Node.js library inspired by Laravel's query builder, designed to simplify the process of constructing MongoDB queries in Node.js applications.

## Installation

To install the MongoDB Query Builder library, simply run:

```bash
npm install mongodb-query-builder
```
### Usage

```code
const { MongoClient } = require('mongodb');
const QueryBuilder = require('mongodb-query-builder');

// Connect to MongoDB
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect();

try {
  // Get reference to the database
  const db = client.db('your_database_name');
  
  // Create a QueryBuilder instance with a collection
  const collection = db.collection('your_collection_name');
  const qb = new QueryBuilder(collection);
  
  // Perform queries using QueryBuilder methods

  // 1. Where Clause
  const results1 = await qb.where('field', '=', 'value').get();
  console.log('Where Clause results:', results1);

  // 2. OrWhere Clause
  const results2 = await qb.where('age', '>', 30).orWhere('city', '=', 'New York').get();
  console.log('OrWhere Clause results:', results2);

  // 3. Select
  const results3 = await qb.select(['name', 'age']).get();
  console.log('Select results:', results3);

  // 4. Order By
  const results4 = await qb.orderBy('age', 'desc').get();
  console.log('Order By results:', results4);

  // 5. Limit and Skip
  const results5 = await qb.limit(10).skip(5).get();
  console.log('Limit and Skip results:', results5);

  // 6. Join
  const ordersCollection = db.collection('orders');
  const results6 = await qb.join('orders', '_id', 'user_id', 'orders').get();
  console.log('Join results:', results6);
} finally {
  // Close the connection
  await client.close();
}

```

### Where Clause
The where method is used to filter documents based on specific criteria.
```code
  // Where Clause Usage
  const results = await qb.where('field', '=', 'value').get();
  console.log('Where Clause results:', results);

```

### OrWhere Clause
The orWhere method allows you to add additional conditions with logical OR operations.
```code
  // OrWhere Clause Usage
  const results = await qb.where('age', '>', 30).orWhere('city', '=', 'New York').get();
  console.log('OrWhere Clause results:', results);

```

### Select
The select method is used to specify which fields to include in the query results.
```code
  // Select Usage
  const results = await qb.select(['name', 'age']).get();
  console.log('Select results:', results);
```

### Order By
```code
The orderBy method is used to sort the query results based on a field and direction.
```


### Limit and Skip
The limit and skip methods are used to limit the number of results returned and skip a specified number of documents.
```code
  // Limit and Skip Usage
  const results = await qb.limit(10).skip(5).get();
  console.log('Limit and Skip results:', results);

```

### Join
The join method is used to perform inner join operations between collections.
```code
  // Join Usage
  const ordersCollection = db.collection('orders');
  const results = await qb.join('orders', '_id', 'user_id', 'orders').get();
  console.log('Join results:', results);
```

### Features
Provides an intuitive and fluent interface for building MongoDB queries.
Supports common query operations such as where, orWhere, select, orderBy, limit, and skip.
Enables advanced query capabilities like join operations between collections.
Lightweight and easy to integrate into existing Node.js projects.
### Contributing
Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

### License
This project is licensed under the ISC License.
