const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Context = require('../context');

let context;
let user;
let normalUser;
let adminUser;

beforeAll(async () => {
  context = await Context.connect();
});

beforeEach(async () => {
  await context.seed();
  process.env.JWT_SECRET = 'abc1234';
  user = {
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
  };
  normalUser = { email: 'john@example.com', password: '123456' };
  adminUser = { email: 'admin@example.com', password: '123456' };
});

afterAll(() => {
  return context.close();
});

it('can create a user', async () => {
  const startingCount = await User.countDocuments();

  await request(app()).post('/api/users').send(user).expect(201);

  const finishCount = await User.countDocuments();
  expect(finishCount - startingCount).toEqual(1);
});

it('check a user', async () => {
  const {
    body: { _id, token },
  } = await request(app()).post('/api/users').send(user);

  const {
    body: { email },
  } = await request(app())
    .get(`/api/users/profile`)
    .set('Authorization', 'Bearer ' + token);
  expect(email).toEqual(user.email);
});

it('login a user', async () => {
  await request(app()).post('/api/users').send(user).expect(201);

  const {
    body: { email },
  } = await request(app())
    .post(`/api/users/login`)
    .send({ email: user.email, password: user.password });
  expect(email).toEqual(user.email);
});

it('normal user can not get all user list', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(normalUser);

  await request(app())
    .get('/api/users')
    .set('Authorization', 'Bearer ' + token)
    .expect(403);
});

it('admin get all user list', async () => {
  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(adminUser);

  await request(app())
    .get('/api/users')
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

it('user can update their profile', async () => {
  const {
    body: { token, _id },
  } = await request(app()).post('/api/users').send(user);

  await request(app())
    .put('/api/users/profile')
    .set('Authorization', 'Bearer ' + token)
    .send({ name: 'updatedUser' })
    .expect(200);
});

it('normal user can not get or edit user by id', async () => {
  const {
    body: { token, _id },
  } = await request(app()).post('/api/users').send(user);

  await request(app())
    .get(`/api/users/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(403);

  await request(app())
    .put(`/api/users/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .send({ name: 'updatedUser' })
    .expect(403);

  await request(app())
    .delete(`/api/users/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(403);
});

it('admin can get or edit/delete user by id', async () => {
  const {
    body: { _id },
  } = await request(app()).post('/api/users').send(user);

  const {
    body: { token },
  } = await request(app()).post('/api/users/login').send(adminUser);

  await request(app())
    .get(`/api/users/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200);

  await request(app())
    .put(`/api/users/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .send({ name: 'updatedUser', email: 'update@test.com', isAdmin: false })
    .expect(200);

  await request(app())
    .delete(`/api/users/${_id}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});
