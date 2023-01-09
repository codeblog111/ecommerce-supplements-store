import { screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import ProfileScreen from '../ProfileScreen';

import axios from 'axios';

jest.mock('axios');

// Jest mock implementation of window.scrollTo
global.scrollTo = () => true;

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

const orders = [
  {
    _id: '60f718d112f3d301b82ff070',
    createdAt: '2021-07-20T18:41:21.273Z',
    totalPrice: 163.23,
    isPaid: false,
  },
];

beforeEach(async () => {
  store = makeTestStore();
  testRender(
    <Router>
      <DisplayState />
      <ProfileScreen location={location} history={history} />
    </Router>,
    {
      store,
    }
  );
  await store.dispatch({ type: 'USER_DETAILS_SUCCESS', payload: userData });
  await store.dispatch({ type: 'USER_LOGIN_SUCCESS', payload: userData });
  await store.dispatch({ type: 'ORDER_LIST_MY_SUCCESS', payload: orders });
});

describe('fill form and submit and check orders', () => {
  // Put async and store update test above any silly tests
  // otherwise it breaks
  it('check order list and update user profile', async () => {
    await axios.put.mockResolvedValueOnce({
      data: { name: 'Updated User', email: 'updatedUser@example.com' },
    });

    await waitFor(() => screen.getByDisplayValue('test@example.com'));

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();

    // Check the order id
    expect(screen.getByText('60f718d112f3d301b82ff070')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    // Wait for the state update
    await waitFor(() => screen.findByText('updatedUser@example.com'));

    expect(screen.getByText('updatedUser@example.com')).toBeInTheDocument();
  });

  it('text inputs and button exists', () => {
    expect(screen.getAllByRole('textbox').length).toEqual(2);
    expect(screen.getAllByRole('button').length).toEqual(1);
    expect(screen.getAllByRole('button')).toBeTruthy();
    expect(screen.queryAllByText(/Password/).length).toEqual(2);
  });
});
