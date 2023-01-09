import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import CartScreen from '../CartScreen';

// Jest mock implementation of window.scrollTo
global.scrollTo = () => true;

let store;

const location = {};
const history = { push: function () {} };
const match = { params: { id: 0 } };

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

beforeEach(async () => {
  store = makeTestStore();
  testRender(
    <Router>
      <CartScreen location={location} history={history} match={match} />
    </Router>,
    {
      store,
    }
  );

  productList.forEach(async (product) => {
    await store.dispatch({ type: 'CART_ADD_ITEM', payload: product });
  });
});

describe('cart screen test', () => {
  it('check cart screen', () => {
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toBeTruthy();
    // screen.debug();
  });

  it('check cart items', () => {
    expect(screen.getByText('Subtotal (76.52)')).toBeInTheDocument();
    expect(screen.getAllByText(/Supplement/).length).toEqual(3);
  });
});
