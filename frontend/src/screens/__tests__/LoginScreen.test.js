import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import LoginScreen from '../LoginScreen';

// Jest mock implementation of window.scrollTo
global.scrollTo = () => true;

// Need this component in order to update the state
// because current LoginScreen doesn't have userLogin to render on screen
function DisplayState() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div>
      <h2>Display State</h2>
      {userInfo && (
        <>
          <h1>{userInfo.username}</h1>
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
  username: 'Test User',
  email: 'test@example.com',
};

const server = setupServer(
  rest.post('/api/users/login', (req, res, ctx) => {
    return res(ctx.json(userData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(async () => {
  store = makeTestStore();

  testRender(
    <>
      <DisplayState />
      <LoginScreen location={location} history={history} />
    </>,
    {
      store,
    }
  );
});

describe('fill form and submit', () => {
  beforeEach(() => {
    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123456' },
    });
  });

  // Put async and store update test above any silly tests
  // otherwise it breaks
  it('when form is submitted, dispach login and get back user from backend', async () => {
    fireEvent.click(screen.getByRole('button'));

    // Wait for the state update
    await waitFor(() => screen.findByText('test@example.com'));

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('text inputs and button exists', () => {
    expect(screen.getAllByRole('textbox').length).toEqual(1);
    expect(screen.getAllByRole('button').length).toEqual(1);
    expect(screen.getAllByRole('button')).toBeTruthy();
    expect(screen.queryAllByText(/Password/).length).toEqual(1);
  });

  it('has email text input that user can type', () => {
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('has password input that user can type', () => {
    expect(screen.getAllByDisplayValue('123456').length).toEqual(1);
  });
});
