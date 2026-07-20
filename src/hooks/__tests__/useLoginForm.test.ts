import { act, renderHook } from '@testing-library/react-native';
import { sendPasswordReset, signInWithEmail, signUpWithEmail } from '../../lib/emailAuth';
import { signInWithGoogle } from '../../lib/googleSignIn';
import { useLoginForm } from '../useLoginForm';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../lib/emailAuth', () => ({
  sendPasswordReset: jest.fn(),
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
}));

jest.mock('../../lib/googleSignIn', () => ({
  signInWithGoogle: jest.fn(),
}));

jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: (s: { setGuest: () => void }) => unknown) =>
    selector({ setGuest: jest.fn() }),
}));

const mockSendPasswordReset = sendPasswordReset as jest.Mock;
const mockSignInWithEmail = signInWithEmail as jest.Mock;
const mockSignUpWithEmail = signUpWithEmail as jest.Mock;
const mockSignInWithGoogle = signInWithGoogle as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockSendPasswordReset.mockResolvedValue({ error: null });
  mockSignInWithEmail.mockResolvedValue({ error: null });
  mockSignUpWithEmail.mockResolvedValue({ error: null });
  mockSignInWithGoogle.mockResolvedValue({ error: null });
});

describe('primaryLabel', () => {
  it('returns auth.signIn in signin mode (default)', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.primaryLabel).toBe('auth.signIn');
  });

  it('returns auth.createAccount in signup mode', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.switchMode('signup'));
    expect(result.current.primaryLabel).toBe('auth.createAccount');
  });

  it('returns auth.sendResetLink in forgot mode', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.switchMode('forgot'));
    expect(result.current.primaryLabel).toBe('auth.sendResetLink');
  });
});

describe('handleSubmit validation', () => {
  it('sets auth.errors.emailRequired when email is empty', async () => {
    const { result } = renderHook(() => useLoginForm());
    await act(async () => result.current.handleSubmit());
    expect(result.current.error).toBe('auth.errors.emailRequired');
  });

  it('sets auth.errors.passwordRequired when password is empty (signin mode)', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.setEmail('user@example.com'));
    await act(async () => result.current.handleSubmit());
    expect(result.current.error).toBe('auth.errors.passwordRequired');
  });

  it('sets auth.errors.passwordsDoNotMatch when passwords differ (signup mode)', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.switchMode('signup');
      result.current.setEmail('user@example.com');
      result.current.setPassword('abc123');
      result.current.setConfirmPassword('xyz999');
    });
    await act(async () => result.current.handleSubmit());
    expect(result.current.error).toBe('auth.errors.passwordsDoNotMatch');
  });

  it('does not require password in forgot mode', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.switchMode('forgot');
      result.current.setEmail('user@example.com');
    });
    await act(async () => result.current.handleSubmit());
    expect(mockSendPasswordReset).toHaveBeenCalledWith('user@example.com');
    expect(result.current.error).toBeNull();
  });
});

describe('handleSubmit success', () => {
  it('sets auth.success.resetLinkSent on successful forgot submit', async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.switchMode('forgot');
      result.current.setEmail('user@example.com');
    });
    await act(async () => result.current.handleSubmit());
    expect(result.current.successMsg).toBe('auth.success.resetLinkSent');
  });

  it('sets auth.success.accountCreated when signup returns confirm_email', async () => {
    mockSignUpWithEmail.mockResolvedValue({ error: 'confirm_email' });
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.switchMode('signup');
      result.current.setEmail('user@example.com');
      result.current.setPassword('abc123');
      result.current.setConfirmPassword('abc123');
    });
    await act(async () => result.current.handleSubmit());
    expect(result.current.successMsg).toBe('auth.success.accountCreated');
  });
});
