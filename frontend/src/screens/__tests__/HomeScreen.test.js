import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import HomeScreen from '../HomeScreen';

import * as topProducts from './data/topProducts.json';
import * as products from './data/products.json';

let store;

let match = { params: { keyword: '', pageNumber: 1 }, url: '/' };

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json(products));
  }),

  rest.get('/api/products/top', (req, res, ctx) => {
    return res(ctx.json(topProducts));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Jest mock implementation of window.confirm
//global.confirm = () => true;

// Mock few components which is tested seperately
jest.mock('../../components/LatestProducts', () => () => {
  return <h1>LatestProducts</h1>;
});

jest.mock('../../components/TrendingBcaa', () => () => {
  return <h1>TrendingBcaa</h1>;
});

jest.mock('../../components/TrendingProtein', () => () => {
  return <h1>TrendingProtein</h1>;
});

beforeEach(async () => {
  store = makeTestStore();

  testRender(<HomeScreen match={match} />, {
    store,
  });
});

describe('Show all products', () => {
  it('list all componets', () => {
    // Check the mocked componets
    expect(screen.getByText('LatestProducts')).toBeInTheDocument();

    expect(screen.getByText('TrendingProtein')).toBeInTheDocument();

    expect(screen.getByText('TrendingBcaa')).toBeInTheDocument();
  });

  it('list all the products', async () => {
    // Need to change the url in order to see all products
    match.url = '/products';

    // Need to re render the screen after change the url
    testRender(<HomeScreen match={match} />, {
      store,
    });

    // Check if the products show up
    await waitFor(() => screen.findAllByText(products.products[0].name));
  });
});
