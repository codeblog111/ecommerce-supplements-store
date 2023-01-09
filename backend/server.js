const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');

const app = require('./app');
const connectDB = require('./config/db');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(__dirname, '../.env.test.local'),
  });
} else {
  dotenv.config();
}

connectDB();

const PORT = process.env.PORT;

app().listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
