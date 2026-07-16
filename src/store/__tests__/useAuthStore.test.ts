import { useAuthStore } from '../useAuthStore';

const INITIAL_STATE = {
  user: null,
  session: null,
  initialized: false,
  isGuest: false,
  requiresPasswordReset: false,
};

beforeEach(() => {
  useAuthStore.setState(INITIAL_STATE);
});

describe('initial state', () => {
  it('starts with all fields at their defaults', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.initialized).toBe(false);
    expect(state.isGuest).toBe(false);
    expect(state.requiresPasswordReset).toBe(false);
  });
});

describe('setSession', () => {
  it('sets session and extracts user from it', () => {
    const fakeSession = {
      user: { id: 'u1', email: 'test@example.com' },
      access_token: 'abc',
    } as any;

    useAuthStore.getState().setSession(fakeSession);

    const { session, user } = useAuthStore.getState();
    expect(session).toEqual(fakeSession);
    expect(user).toEqual(fakeSession.user);
  });

  it('clears user and session when called with null', () => {
    useAuthStore.setState({
      session: { user: { id: 'u1' } } as any,
      user: { id: 'u1' } as any,
    });

    useAuthStore.getState().setSession(null);

    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('setInitialized', () => {
  it('sets initialized to true', () => {
    useAuthStore.getState().setInitialized(true);
    expect(useAuthStore.getState().initialized).toBe(true);
  });

  it('sets initialized back to false', () => {
    useAuthStore.setState({ initialized: true });
    useAuthStore.getState().setInitialized(false);
    expect(useAuthStore.getState().initialized).toBe(false);
  });
});

describe('setGuest', () => {
  it('sets isGuest to true', () => {
    useAuthStore.getState().setGuest(true);
    expect(useAuthStore.getState().isGuest).toBe(true);
  });

  it('sets isGuest back to false', () => {
    useAuthStore.setState({ isGuest: true });
    useAuthStore.getState().setGuest(false);
    expect(useAuthStore.getState().isGuest).toBe(false);
  });
});

describe('setRequiresPasswordReset', () => {
  it('sets requiresPasswordReset to true', () => {
    useAuthStore.getState().setRequiresPasswordReset(true);
    expect(useAuthStore.getState().requiresPasswordReset).toBe(true);
  });

  it('sets requiresPasswordReset back to false', () => {
    useAuthStore.setState({ requiresPasswordReset: true });
    useAuthStore.getState().setRequiresPasswordReset(false);
    expect(useAuthStore.getState().requiresPasswordReset).toBe(false);
  });
});
