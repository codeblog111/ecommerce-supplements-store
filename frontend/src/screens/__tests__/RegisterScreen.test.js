import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { testRender, makeTestStore } from '../../reduxTestUtils';
import RegisterScreen from '../RegisterScreen';

// Need this component in order to update the state
// because current RegisterScreen doesn't have userLogin to render on screen
function DisplayState() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <div>
      <h2>Display State</h2>
      {userInfo && (
        <>
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
  name: 'Test User',
  email: 'test@example.com',
};

const server = setupServer(
  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.json(userData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  store = makeTestStore();
  testRender(
    <>
      <DisplayState />
      <RegisterScreen location={location} history={history} />
    </>,
    {
      store,
    }
  );
});

describe('fill form and submit', () => {
  beforeEach(() => {
    fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), {
      target: { value: 'Test User' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123456' },
    });

    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: '123456' },
    });
  });

  it('when form is submitted, dispach register and get back user from backend', async () => {
    fireEvent.click(screen.getByRole('button'));

    // Wait for the state update
    await waitFor(() => screen.findByText('test@example.com'));

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('text inputs and button exists', () => {
    // screen.getAllByRole('');
    expect(screen.getAllByRole('textbox').length).toEqual(2);
    expect(screen.getAllByRole('button').length).toEqual(1);
    expect(screen.getAllByRole('button')).toBeTruthy();
    expect(screen.queryAllByText(/Password/).length).toEqual(2);
  });

  it('has user name text input that user can type', () => {
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
  });

  it('has email text input that user can type', () => {
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('has password and confirm password input that user can type', () => {
    expect(screen.getAllByDisplayValue('123456').length).toEqual(2);
  });
});
