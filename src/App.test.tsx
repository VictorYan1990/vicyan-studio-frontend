import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    // App uses BrowserRouter, which reads the URL from jsdom's window —
    // reset it so a navigation in one test doesn't leak into the next.
    window.history.pushState({}, '', '/');
  });

  it('renders the home page by default', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Welcome' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('VicYan Studio — personal site.')
    ).toBeInTheDocument();
  });

  it('shows the site navigation', () => {
    render(<App />);

    // The logo is a plain image (not a link); the site name is the home link.
    expect(screen.getByRole('img', { name: 'VicYan Studio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'VicYan Studio' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ABOUT' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'EXPERIENCE' })).toBeInTheDocument();
  });

  it('navigates to the About page via the nav link', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: 'ABOUT' }));

    expect(window.location.pathname).toBe('/about');
    // Jest stubs .md imports with their filename, so the rendered markdown
    // body is the string "Profile.md" — good enough to prove the right
    // page mounted.
    expect(screen.getByText('Profile.md')).toBeInTheDocument();
  });

  it('navigates to the Experience page via the nav link', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: 'EXPERIENCE' }));

    expect(window.location.pathname).toBe('/experience');
    expect(screen.getByText('Experience.md')).toBeInTheDocument();
  });
});
