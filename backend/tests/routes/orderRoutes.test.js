const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Context = require('../context');

jest.setTimeout(30000);

let context;

let normalUser;
let adminUser;
let anotherUser;
let order = {
  orderItems: [
    {
      _id: '60f718d112f3d301b82ff071',
      product: '60e70fcf9235547bb00c78b9',
      name: 'Optimum Nutrition Gold Standard 100% Whey Protein',
      image: '/images/OPT007_900x.png',
      price: 29.99,
      qty: 1,
    },
  ],
  shippingAddress: {
    address: '101 main street',
    city: 'Boston',
    postalCode: '1234',
    country: 'USA',
  },
  paymentMethod: 'PayPal',
  taxPrice: 8.25,
  shippingPrice: 100,
  totalPrice: 163.23,
};

beforeAll(async () => {
  context = await Context.connect();
});

beforeEach(async () => {
  await context.seed();
  process.env.JWT_SECRET = 'abc1234';
  normalUser = { email: 'john@example.com', password: '123456' };
  anotherUser = { email: 'jane@example.com', password: '123456' };
  adminUser = { email: 'admin@example.com', password: '123456' };
});

afterAll(() => {
  return context.close();
});

it('only logged in user can create an order', async () => {
  await request(app()).post('/api/orders').send(order).expect(401);
});

it('logged in user can create an order', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  await request(app())
    .post('/api/orders')
    .set('Authorization', 'Bearer ' + token)
    .send(order)
    .expect(201);
});

it('logged in user can only get the orders created by the user', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  await request(app())
    .post('/api/orders')
    .set('Authorization', 'Bearer ' + token)
    .send(order)
    .expect(201);

  const {
    body: { token: tokenB },
  } = await request(app()).post('/api/users/login').send(anotherUser);

  await request(app())
    .post('/api/orders')
    .set('Authorization', 'Bearer ' + tokenB)
    .send(order)
    .expect(201);

  const { body: orders } = await request(app())
    .get('/api/orders/myorders')
    .set('Authorization', 'Bearer ' + token);

  expect(orders.length).toEqual(1);
});

it('logged in user get their order by id', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  const {
    body: { _id: orderId },
  } = await request(app())
    .post('/api/orders')
    .set('Authorization', 'Bearer ' + token)
    .send(order)
    .expect(201);

  await request(app())
    .get(`/api/orders/${orderId}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

it('only admin get all order list', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  const {
    body: { token: tokenB },
  } = await request(app()).post('/api/users/login').send(anotherUser);

  const {
    body: { token: tokenC },
  } = await request(app()).post('/api/users/login').send(adminUser);

  await request(app())
    .post('/api/orders')
    .set('Authorization', 'Bearer ' + token)
    .send(order)
    .expect(201);

  await request(app())
    .post('/api/orders')
    .set('Authorization', 'Bearer ' + tokenB)
    .send(order)
    .expect(201);

  const { body: orders } = await request(app())
    .get('/api/orders')
    .set('Authorization', 'Bearer ' + tokenC)
    .expect(200);

  expect(orders.length).toEqual(2);
});
