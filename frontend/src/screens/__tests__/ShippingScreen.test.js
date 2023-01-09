import { screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ShippingScreen from '../ShippingScreen';

import axios from 'axios';

jest.mock('axios');

// Need this component in order to update the state
// because current ProfileScreen doesn't have userUpdate to render on screen
function DisplayState() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div>
      <h2>Display State</h2>
      {userInfo && (
        <>
          <h1>{userInfo._id}</h1>
          <h1>{userInfo.name}</h1>
          <h1>{userInfo.email}</h1>
        </>
      )}
    </div>
  );
}

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
  await store.dispatch({
    type: 'CART_SAVE_SHIPPING_ADDRESS',
    payload: shippingAddress,
  });
  testRender(
    <Router>
      <DisplayState />
      <ShippingScreen history={history} />
    </Router>,
    {
      store,
    }
  );

  await store.dispatch({ type: 'USER_LOGIN_SUCCESS', payload: userData });
});

describe('fill shipping address form', () => {
  // beforeEach(() => {

  // });

  // Put async and store update test above any silly tests
  // otherwise it breaks
  it('check form fill with saved data then change country and submit', async () => {
    await waitFor(() => screen.getByText('test@example.com'));

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Boston')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234')).toBeInTheDocument();
    expect(screen.getByDisplayValue('101 main street')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: /Country/ }), {
      target: { value: 'China' },
    });

    fireEvent.click(screen.getByText('Countinue'));

    await waitFor(() => {
      expect(store.getState().cart.shippingAddress.country).toEqual('China');
    });
  });

  it('fill form with new data', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: /Address/ }), {
      target: { value: '12 main street' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /City/ }), {
      target: { value: 'Shenzhen' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /Postal Code/ }), {
      target: { value: '6666' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /Country/ }), {
      target: { value: 'China' },
    });

    expect(screen.getByDisplayValue('China')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Shenzhen')).toBeInTheDocument();
    expect(screen.getByDisplayValue('6666')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12 main street')).toBeInTheDocument();
  });

  it('text inputs and button exists', () => {
    expect(screen.getAllByRole('textbox').length).toEqual(4);
    expect(screen.getAllByRole('button').length).toEqual(3); // button + bread crumbs (has role button)
    expect(screen.getAllByRole('button')).toBeTruthy();
  });
});
