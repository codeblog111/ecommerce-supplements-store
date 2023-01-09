const request = require('supertest');

const app = require('../app');
const Context = require('./context');

let context;

beforeAll(async () => {
  context = await Context.connect();
});

afterAll(() => {
  return context.close();
});

it('test app', async () => {
  await context.reset();
  await request(app()).get('/').expect(200);
});
