import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import * as data from './data/trendingBcaa.json'

import { testRender, makeTestStore } from '../../reduxTestUtils';
import TrendingBcaa from '../TrendingBcaa';

let store;

const server = setupServer(
  rest.get('/api/products/trending', (req, res, ctx) => {
    let category = req.url.searchParams.get('category')
    if (category === 'bcaa'){
      return res(ctx.json(data))
    }
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(async () => {
  store = makeTestStore();

  testRender(<TrendingBcaa />, {
    store,
  });
});

describe('Show list of 4 trending bcaa products', () => {
  it('Check products shows', async () => {
    await waitFor(() => screen.findByText(data.products[0].name));
    //screen.debug()
    //console.log(store.getState())
    expect(
      screen.getByText(data.products[0].name)
    ).toBeInTheDocument();

    expect(
      screen.getByText(data.products[1].name)
    ).toBeInTheDocument();

    expect(
      screen.getByText(data.products[2].name)
    ).toBeInTheDocument();

    expect(
      screen.getByText(data.products[3].name)
    ).toBeInTheDocument();
  });
});
