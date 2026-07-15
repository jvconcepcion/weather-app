import { renderHook } from '@testing-library/react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useProtectedRoute } from '../useProtectedRoute';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

const mockReplace = jest.fn();

const AUTH_INITIAL = {
  user: null,
  session: null,
  initialized: false,
  isGuest: false,
  requiresPasswordReset: false,
};

beforeEach(() => {
  mockReplace.mockClear();
  (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  (useSegments as jest.Mock).mockReturnValue(['']);
  useAuthStore.setState(AUTH_INITIAL);
});

describe('useProtectedRoute — not initialized', () => {
  it('does not navigate before the store is initialized', () => {
    useAuthStore.setState({ initialized: false });
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe('useProtectedRoute — unauthenticated user', () => {
  it('redirects to /login from a protected screen', () => {
    useAuthStore.setState({ initialized: true, user: null, isGuest: false });
    (useSegments as jest.Mock).mockReturnValue(['index']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('does not redirect when already on /login', () => {
    useAuthStore.setState({ initialized: true, user: null, isGuest: false });
    (useSegments as jest.Mock).mockReturnValue(['login']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not redirect when on the auth callback screen', () => {
    useAuthStore.setState({ initialized: true, user: null, isGuest: false });
    (useSegments as jest.Mock).mockReturnValue(['auth']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not redirect when on the reset-password screen', () => {
    useAuthStore.setState({ initialized: true, user: null, isGuest: false });
    (useSegments as jest.Mock).mockReturnValue(['reset-password']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe('useProtectedRoute — authenticated user', () => {
  const fakeUser = { id: 'u1', email: 'test@example.com' } as any;

  it('redirects away from /login to home', () => {
    useAuthStore.setState({ initialized: true, user: fakeUser, requiresPasswordReset: false });
    (useSegments as jest.Mock).mockReturnValue(['login']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('redirects away from /auth/callback to home', () => {
    useAuthStore.setState({ initialized: true, user: fakeUser, requiresPasswordReset: false });
    (useSegments as jest.Mock).mockReturnValue(['auth']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('does not redirect when on a protected screen', () => {
    useAuthStore.setState({ initialized: true, user: fakeUser, requiresPasswordReset: false });
    (useSegments as jest.Mock).mockReturnValue(['index']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

describe('useProtectedRoute — guest user', () => {
  it('allows guest access to a protected screen', () => {
    useAuthStore.setState({
      initialized: true,
      user: null,
      isGuest: true,
      requiresPasswordReset: false,
    });
    (useSegments as jest.Mock).mockReturnValue(['index']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects guest away from /login to home', () => {
    useAuthStore.setState({
      initialized: true,
      user: null,
      isGuest: true,
      requiresPasswordReset: false,
    });
    (useSegments as jest.Mock).mockReturnValue(['login']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});

describe('useProtectedRoute — password reset required', () => {
  const fakeUser = { id: 'u1' } as any;

  it('redirects to /reset-password from a non-reset screen', () => {
    useAuthStore.setState({ initialized: true, user: fakeUser, requiresPasswordReset: true });
    (useSegments as jest.Mock).mockReturnValue(['index']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).toHaveBeenCalledWith('/reset-password');
  });

  it('does not redirect when already on /reset-password', () => {
    useAuthStore.setState({ initialized: true, user: fakeUser, requiresPasswordReset: true });
    (useSegments as jest.Mock).mockReturnValue(['reset-password']);
    renderHook(() => useProtectedRoute());
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
