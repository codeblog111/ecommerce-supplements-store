import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock component and screens
jest.mock('../components/Header', () => () => <div>Header</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);
jest.mock('../screens/HomeScreen', () => () => <div>HomeScreen</div>);

test('check componets and screens on App', () => {
  render(<App />);
  const Header = screen.getByText(/Header/);
  const Footer = screen.getByText(/Footer/);
  const HomeScreen = screen.getByText(/HomeScreen/);

  expect(Header).toBeInTheDocument();
  expect(Footer).toBeInTheDocument();
  expect(HomeScreen).toBeInTheDocument();
});
