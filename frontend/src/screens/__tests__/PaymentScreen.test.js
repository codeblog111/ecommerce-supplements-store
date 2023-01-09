import { screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import PaymentScreen from '../PaymentScreen';

import axios from 'axios';

jest.mock('axios');

let store;

const location = {};
const history = { push: function () {} };

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

beforeEach(async () => {
  store = makeTestStore();
  await store.dispatch({ type: 'USER_LOGIN_SUCCESS', payload: userData });
  await store.dispatch({
    type: 'CART_SAVE_SHIPPING_ADDRESS',
    payload: shippingAddress,
  });
  testRender(
    <Router>
      <PaymentScreen history={history} />
    </Router>,
    {
      store,
    }
  );
});

describe('Check payment screen', () => {
  // Put async and store update test above any silly tests
  // otherwise it breaks
  it('check PayPal in the screen and submit', async () => {
    expect(screen.getByText(/PayPal/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Countinue'));

    await waitFor(() =>
      expect(store.getState().cart.paymentMethod).toEqual('PayPal')
    );
  });
});
