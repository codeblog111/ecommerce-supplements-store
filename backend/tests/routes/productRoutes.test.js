const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Context = require('../context');

let context;

let normalUser;
let adminUser;

beforeAll(async () => {
  context = await Context.connect();
});

beforeEach(async () => {
  await context.seed();
  process.env.JWT_SECRET = 'abc1234';
  normalUser = { email: 'john@example.com', password: '123456' };
  adminUser = { email: 'admin@example.com', password: '123456' };
});

afterAll(() => {
  return context.close();
});

it('can get all the products', async () => {
  const {
    body: { products },
  } = await request(app()).get('/api/products');
  // Expect 6 products
  expect(products.length).toEqual(6);
});

it('can get product by id', async () => {
  const {
    body: { products },
  } = await request(app()).get('/api/products');
  const id = products[0]._id;

  await request(app()).get(`/api/products/${id}`).expect(200);
});

it('can get products by category', async () => {
  let category = 'protein';
  let {
    body: { products },
  } = await request(app()).get(`/api/products?category=${category}`);

  expect(products.length).toEqual(1);
  products.forEach((p) => expect(p.category).toEqual(category));
});

it('can get top products', async () => {
  let { body } = await request(app()).get('/api/products/top');
  expect(body.length).toEqual(3);
});

it('can get latest 4 products', async () => {
  let {
    body: { products },
  } = await request(app()).get('/api/products/latest');
  expect(products.length).toEqual(4);
});

it('can get trending products by category', async () => {
  let category = 'protein';
  let {
    body: { products },
  } = await request(app()).get(`/api/products/trending?category=${category}`);

  products.forEach((p) => expect(p.category).toEqual(category));
});

it('normal user can not create a product', async () => {
  const {
    body: { _id, token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  await request(app())
    .post(`/api/products`)
    .set('Authorization', 'Bearer ' + token)
    .expect(403);
});

it('admin user can create a product', async () => {
  const {
    body: { _id, token },
  } = await request(app()).post('/api/users/login').send(adminUser);

  await request(app())
    .post(`/api/products`)
    .set('Authorization', 'Bearer ' + token)
    .expect(201);
});

it('non login user can not add review to a product', async () => {
  const {
    body: { products },
  } = await request(app()).get('/api/products');
  const id = products[0]._id;

  await request(app())
    .post(`/api/products/${id}/reviews`)
    .send({ rating: 5, comment: 'great product' })
    .expect(401);
});

it('login user can add review to a product', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  const {
    body: { products },
  } = await request(app()).get('/api/products');

  const id = products[0]._id;

  const {
    body: { message },
  } = await request(app())
    .post(`/api/products/${id}/reviews`)
    .set('Authorization', 'Bearer ' + token)
    .send({ rating: 5, comment: 'great product' })
    .expect(201);

  expect(message).toEqual('Review added');
});

it('admin can create, update, delete a product', async () => {
  let testProduct = {
    name: 'test name',
    price: 10,
    image: '/image/sample.jpg',
    description: 'Test description',
    brand: 'test brand',
    category: 'testCategory',
    countInStock: 1,
  };
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(adminUser);

  // Create a product
  const {
    body: { _id },
  } = await request(app())
    .post(`/api/products`)
    .set('Authorization', 'Bearer ' + token)
    .expect(201);

  // Update a product
  const { body: product } = await request(app())
    .put(`/api/products/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .send(testProduct)
    .expect(201);
  expect(product.name).toEqual(testProduct.name);

  // Delete a product
  await request(app())
    .delete(`/api/products/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});
