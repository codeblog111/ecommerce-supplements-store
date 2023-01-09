const mongoose = require('mongoose');
const { randomBytes } = require('crypto');
const colors = require('colors');

const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// sample data
const users = require('./data/users');
const products = require('./data/products');

class Context {
  constructor() {}

  static async connect() {
    // Randomly generating a testDB name
    const dbName = 'phanox_test' + randomBytes(4).toString('hex');

    const dbHost = process.env.DB_HOST || 'localhost';

    const mongoUri = `mongodb://${dbHost}/${dbName}`;
    try {
      const conn = await mongoose.connect(mongoUri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      });

      console.log(
        `MongoDB connected: ${conn.connection.host}/${dbName}`.cyan.underline
      );
    } catch (error) {
      console.error(`Error: ${error.message}`.red.underline.bold);
    }

    return new Context(dbName);
  }

  async close() {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }

  async reset() {
    try {
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();

      console.log('Data destroyed!'.red.inverse);
    } catch (error) {
      console.error(`${error}`.red.inverse);
    }
  }

  async seed() {
    try {
      await this.reset();
      const createdUsers = await User.insertMany(users);

      const adminUser = createdUsers[0]._id;

      const sampleProducts = products.map((product) => {
        return { ...product, user: adminUser };
      });

      await Product.insertMany(sampleProducts);

      console.log('Data imported!'.green.inverse);
    } catch (error) {
      console.error(`${error}`.red.inverse);
    }
  }
}

module.exports = Context;
