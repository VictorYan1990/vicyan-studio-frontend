import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    // App uses BrowserRouter, which reads the URL from jsdom's window —
    // reset it so a navigation in one test doesn't leak into the next.
    window.history.pushState({}, '', '/');
  });

  it('renders the home page hero by default', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Victor Yan' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('I build data platforms for finance.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'See experience →' })
    ).toBeInTheDocument();
  });

  it('shows the site navigation', () => {
    render(<App />);

    // The logo is a plain image (not a link); the wordmark is the home link.
    expect(screen.getByRole('img', { name: 'VicYan Studio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'VicYan Studio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Experience' })).toBeInTheDocument();
  });

  it('shows social links with the right destinations in the footer', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/VictorYan1990'
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/yajun-yan/'
    );
  });

  it('navigates to the About page via the nav link', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(window.location.pathname).toBe('/about');
    // Jest stubs .md imports with their filename, so the rendered markdown
    // body is the string "Profile.md" — good enough to prove the right
    // page mounted.
    expect(screen.getByText('Profile.md')).toBeInTheDocument();
  });

  it('navigates to the Experience page via the nav link', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Experience' }));

    expect(window.location.pathname).toBe('/experience');
    expect(
      screen.getByText(/BlackRock Inc., Aladdin Wealth Technology/)
    ).toBeInTheDocument();
    expect(
      screen.getByText('Senior Engineer II / Tech Lead (Vice President)')
    ).toBeInTheDocument();
  });
});
