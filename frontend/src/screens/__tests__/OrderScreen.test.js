import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import OrderScreen from '../OrderScreen';

// Mock console.log on useEffect
global.console = {log: jest.fn()}

let store;

const history = { push: function () {} };
const match = { params: { id: '60f718d112f3d301b82ff070' } };

const productList = [
  {
    product: '1',
    name: 'Supplement A',
    image: '/images/productA.png',
    price: 29.99,
    countInStock: 10,
    qty: 1,
  },
  {
    product: '2',
    name: 'Supplement B',
    image: '/images/productB.png',
    price: 12.99,
    countInStock: 4,
    qty: 2,
  },
  {
    product: '3',
    name: 'Supplement C',
    image: '/images/productC.png',
    price: 20.55,
    countInStock: 8,
    qty: 1,
  },
];

const userData = {
  _id: '1231231231',
  name: 'Test User',
  email: 'test@example.com',
  isAdmin: false,
};

const shippingAddress = {
  address: '101 main street',
  city: 'Boston',
  postalCode: '1234',
  country: 'USA',
};

const order = {
  shippingAddress,
  taxPrice: 11.48,
  shippingPrice: 100,
  totalPrice: 188.0,
  isPaid: false,
  isDelivered: false,
  _id: '60f718d112f3d301b82ff070',
  user: userData,
  orderItems: [
    {
      _id: '60f718d112f3d301b82ff071',
      product: '1',
      name: 'Supplement A',
      image: '/images/OPT007_900x.png',
      price: 29.99,
      qty: 1,
    },
    {
      _id: '60f718d112f3d301b82ff072',
      product: '2',
      name: 'Supplement B',
      image: '/images/SV2441534_900x.png',
      price: 12.99,
      qty: 2,
    },
    {
      _id: '60f718d112f3d301b82ff042',
      product: '3',
      name: 'Supplement C',
      image: '/images/SV2441534_900x.png',
      price: 20.55,
      qty: 1,
    },
  ],
  paymentMethod: 'PayPal',
  createdAt: '2021-07-20T18:41:21.273Z',
  updatedAt: '2021-07-20T18:41:21.273Z',
  __v: 0,
};

const server = setupServer(
  // for paypal
  rest.get('/api/config/paypal', (req, res, ctx) => {
    return res(ctx.json({ clientId: 'abc1234' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(async () => {
  store = makeTestStore();
  await store.dispatch({ type: 'USER_LOGIN_SUCCESS', payload: userData });

  productList.forEach(async (product) => {
    await store.dispatch({ type: 'CART_ADD_ITEM', payload: product });
  });

  await store.dispatch({
    type: 'CART_SAVE_SHIPPING_ADDRESS',
    payload: shippingAddress,
  });

  await store.dispatch({
    type: 'CART_SAVE_PAYMENT_METHOD',
    payload: 'PayPal',
  });

  await store.dispatch({
    type: 'ORDER_DETAILS_SUCCESS',
    payload: order,
  });

  testRender(<OrderScreen history={history} match={match} />, {
    store,
  });
});

describe('Check Order Screen', () => {
  it('check current order details', async () => {
    expect(screen.getByText(/60f718d112f3d301b82ff070/)).toBeInTheDocument();
    expect(screen.getByText('Not Paid')).toBeInTheDocument();
  });
});
