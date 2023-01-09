import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import * as latestProducts from './data/latestProducts.json'

import { testRender, makeTestStore } from '../../reduxTestUtils';
import LatestProducts from '../LatestProducts';

let store;

const server = setupServer(
  rest.get('/api/products/latest', (req, res, ctx) => {
    return res(ctx.json(latestProducts));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(async () => {
  store = makeTestStore();

  testRender(<LatestProducts />, {
    store,
  });
});

describe('Show list of 4 latest products', () => {
  it('Check products shows', async () => {
    await waitFor(() => screen.findByText(latestProducts.products[0].name));
    //screen.debug()
    //console.log(store.getState())
    expect(
      screen.getByText(latestProducts.products[0].name)
    ).toBeInTheDocument();

    expect(
      screen.getByText(latestProducts.products[1].name)
    ).toBeInTheDocument();

    expect(
      screen.getByText(latestProducts.products[2].name)
    ).toBeInTheDocument();

    expect(
      screen.getByText(latestProducts.products[3].name)
    ).toBeInTheDocument();
  });
});
