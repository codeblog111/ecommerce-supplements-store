import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import PlaceOrderScreen from '../PlaceOrderScreen';

let store;

const push = jest.fn((path) => console.log(path));
const history = { push: push };

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
  rest.post('/api/orders', (req, res, ctx) => {
    return res(ctx.json(order));
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

  testRender(
    <>
      <PlaceOrderScreen history={history} />
    </>,
    {
      store,
    }
  );
});

describe('Check Place Order Screen', () => {
  it('check PayPal in the screen and submit', async () => {
    expect(screen.getByText(/PayPal/)).toBeInTheDocument();
    expect(screen.getByText(/USA/)).toBeInTheDocument();
    expect(screen.getAllByText(/Supplement/).length).toEqual(3);

    fireEvent.click(screen.getByRole('button'));

    // Wait for the state update and make sure the component push to next screen
    await waitFor(() =>
      // The first arg of first call to the function was {/order/${order._id}}
      expect(push.mock.calls[0][0]).toBe(`/order/${order._id}`)
    );

    // await waitFor(() => console.log(store.getState()));
    //screen.debug();
  });
});
