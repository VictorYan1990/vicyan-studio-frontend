import { getAuthToken, fetchWithAuth } from './api';

describe('getAuthToken', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns the token when one is stored', () => {
    localStorage.setItem('authToken', 'my-token');
    expect(getAuthToken()).toBe('my-token');
  });

  it('returns null when no token is stored', () => {
    expect(getAuthToken()).toBeNull();
  });
});

describe('fetchWithAuth', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  it('throws when no token is stored', async () => {
    await expect(fetchWithAuth('/some/endpoint')).rejects.toThrow(
      'No authentication token found'
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sends the request with a Bearer Authorization header', async () => {
    localStorage.setItem('authToken', 'my-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ username: 'victor' }),
    });

    await fetchWithAuth('/auth/verify');

    expect(mockFetch).toHaveBeenCalledWith('/auth/verify', {
      headers: { Authorization: 'Bearer my-token' },
    });
  });

  it('preserves caller-supplied options and headers', async () => {
    localStorage.setItem('authToken', 'my-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await fetchWithAuth('/some/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(mockFetch).toHaveBeenCalledWith('/some/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer my-token',
      },
    });
  });

  it('returns the parsed JSON body on success', async () => {
    localStorage.setItem('authToken', 'my-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ username: 'victor' }),
    });

    const result = await fetchWithAuth('/auth/verify');

    expect(result).toEqual({ username: 'victor' });
  });

  it('throws with the status code when the response is not ok', async () => {
    localStorage.setItem('authToken', 'expired-token');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });

    await expect(fetchWithAuth('/auth/verify')).rejects.toThrow(
      'HTTP error! status: 401'
    );
  });
});
