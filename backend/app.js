const path = require('path');

const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes.js');

module.exports = () => {
  const app = express();

  // Body parser
  app.use(express.json());

  // Run morgan logger in dev mode
  if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }

  if (process.env.NODE_ENV === 'production') {
    // Sanitize incoming data
    app.use(mongoSanitize());

    // Set security headers
    app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    // Prevent XSS attacks
    app.use(xss());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // limit each IP to 100 request per windowMs
    });

    // Apply to all requests
    app.use(limiter);

    // Prevent http params pollution
    app.use(hpp());

    // Enable cors
    app.use(cors());
  }

  app.use('/api/products', productRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/upload', uploadRoutes);

  app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
  );

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Serve client page
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'frontend/build')));
    app.get('*', (req, res) =>
      res.sendFile(
        path.resolve(process.cwd(), 'frontend', 'build', 'index.html')
      )
    );
  } else {
    app.get('/', (req, res) => res.send('API is running'));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
