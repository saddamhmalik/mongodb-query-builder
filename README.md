# MongoDB Query Builder

The MongoDB Query Builder is a Node.js library inspired by Laravel's query builder, designed to simplify the process of constructing MongoDB queries in Node.js applications.

## Installation

To install the MongoDB Query Builder library, simply run:

```bash
npm install @saddamhmalik/mongodb-query-builder
```
### Usage

```code
import express from 'express';
import mongoose from 'mongoose';
import QueryBuilder from '@saddamhmalik/mongodb-query-builder';

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/tasks')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const Task = mongoose.model('Task', taskSchema);

app.get('/', async (req, res) => {
    try {
        // Example usage of MongoDB Query Builder
        const qb = new QueryBuilder(Task);
        const results = await qb.where('title', '=', 'New Task').orWhere('title','=','three').get();

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message:error});
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

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
