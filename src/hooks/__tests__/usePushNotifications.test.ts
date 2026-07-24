import { act, renderHook } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { upsertPushToken } from '../../lib/pushTokens';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePushNotifications } from '../usePushNotifications';

const mockPush = jest.fn();
const mockSetPushToken = jest.fn();
const mockSetPushTokenError = jest.fn();

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: { eas: { projectId: 'test-project-id' } } },
    easConfig: null,
  },
}));

jest.mock('expo-notifications', () => ({
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  AndroidImportance: { MAX: 5 },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../../lib/pushTokens', () => ({
  upsertPushToken: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../store/useAppStore', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockGetPermissionsAsync = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissionsAsync = Notifications.requestPermissionsAsync as jest.Mock;
const mockGetExpoPushTokenAsync = Notifications.getExpoPushTokenAsync as jest.Mock;
const mockAddResponseListener = Notifications.addNotificationResponseReceivedListener as jest.Mock;
const mockAddReceivedListener = Notifications.addNotificationReceivedListener as jest.Mock;
const mockUpsertPushToken = upsertPushToken as jest.Mock;

const TOKEN = 'ExponentPushToken[test]';

function setupStores({
  pushToken = null as string | null,
  user = null as { id: string } | null,
} = {}) {
  (useAppStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({
      setPushToken: mockSetPushToken,
      setPushTokenError: mockSetPushTokenError,
      pushToken,
    }),
  );
  (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => selector({ user }));
}

beforeEach(() => {
  jest.clearAllMocks();
  setupStores();
  mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });
  mockRequestPermissionsAsync.mockResolvedValue({ status: 'denied' });
  mockGetExpoPushTokenAsync.mockResolvedValue({ data: TOKEN });
  mockAddReceivedListener.mockReturnValue({ remove: jest.fn() });
  mockAddResponseListener.mockReturnValue({ remove: jest.fn() });
});

describe('token registration', () => {
  it('sets token and clears error when permission is already granted', async () => {
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockSetPushToken).toHaveBeenCalledWith(TOKEN);
    expect(mockSetPushTokenError).toHaveBeenCalledWith(null);
  });

  it('requests permissions when not already granted then sets token', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
    mockRequestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockRequestPermissionsAsync).toHaveBeenCalled();
    expect(mockSetPushToken).toHaveBeenCalledWith(TOKEN);
    expect(mockSetPushTokenError).toHaveBeenCalledWith(null);
  });

  it('sets error and null token when user denies the permission prompt', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
    // mockRequestPermissionsAsync already defaults to { status: 'denied' }
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockSetPushToken).toHaveBeenCalledWith(null);
    expect(mockSetPushTokenError).toHaveBeenCalledWith(
      'Permission denied. Enable notifications in device settings.',
    );
  });

  it('sets error and null token when getExpoPushTokenAsync throws', async () => {
    mockGetExpoPushTokenAsync.mockRejectedValue(new Error('Network error'));
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockSetPushToken).toHaveBeenCalledWith(null);
    expect(mockSetPushTokenError).toHaveBeenCalledWith('Error: Network error');
  });
});

describe('supabase token sync', () => {
  it('calls upsertPushToken when both user and pushToken are present', async () => {
    setupStores({ pushToken: TOKEN, user: { id: 'user-123' } });
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockUpsertPushToken).toHaveBeenCalledWith('user-123', TOKEN);
  });

  it('does not call upsertPushToken when user is null', async () => {
    setupStores({ pushToken: TOKEN, user: null });
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockUpsertPushToken).not.toHaveBeenCalled();
  });

  it('does not call upsertPushToken when pushToken is null', async () => {
    setupStores({ pushToken: null, user: { id: 'user-123' } });
    renderHook(() => usePushNotifications());
    await act(async () => {});
    expect(mockUpsertPushToken).not.toHaveBeenCalled();
  });
});

describe('notification tap handler', () => {
  it('navigates to city screen when tap contains full city data', async () => {
    renderHook(() => usePushNotifications());
    await act(async () => {});
    const onResponse = mockAddResponseListener.mock.calls[0][0];
    act(() => {
      onResponse({
        notification: {
          request: {
            content: {
              data: { cityId: '42', cityName: 'Manila', lat: '14.5995', lon: '120.9842' },
            },
          },
        },
      });
    });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/location/[id]',
      params: { id: '42', name: 'Manila', lat: '14.5995', lon: '120.9842' },
    });
  });

  it('navigates to home when tap data is empty', async () => {
    renderHook(() => usePushNotifications());
    await act(async () => {});
    const onResponse = mockAddResponseListener.mock.calls[0][0];
    act(() => {
      onResponse({ notification: { request: { content: { data: {} } } } });
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigates to home when tap data has partial city fields', async () => {
    renderHook(() => usePushNotifications());
    await act(async () => {});
    const onResponse = mockAddResponseListener.mock.calls[0][0];
    act(() => {
      onResponse({
        notification: {
          request: { content: { data: { cityId: '42', cityName: 'Manila' } } },
        },
      });
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});

describe('listener cleanup', () => {
  it('removes both listeners on unmount', async () => {
    const receivedRemove = jest.fn();
    const responseRemove = jest.fn();
    mockAddReceivedListener.mockReturnValue({ remove: receivedRemove });
    mockAddResponseListener.mockReturnValue({ remove: responseRemove });

    const { unmount } = renderHook(() => usePushNotifications());
    await act(async () => {});
    unmount();

    expect(receivedRemove).toHaveBeenCalled();
    expect(responseRemove).toHaveBeenCalled();
  });
});
