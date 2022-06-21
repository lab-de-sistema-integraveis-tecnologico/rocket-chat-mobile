import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

jest.mock('react-native-mmkv-storage', () => ({
	Loader: jest.fn().mockImplementation(() => ({
		setProcessingMode: jest.fn().mockImplementation(() => ({
			withEncryption: jest.fn().mockImplementation(() => ({
				initialize: jest.fn()
			}))
		})),
		withInstanceID: jest.fn().mockImplementation(() => ({
			initialize: jest.fn()
		}))
	})),
	create: jest.fn(),
	MODES: { MULTI_PROCESS: '' }
}));

jest.mock('rn-fetch-blob', () => ({
	fs: {
		dirs: {
			DocumentDir: '/data/com.rocket.chat/documents',
			DownloadDir: '/data/com.rocket.chat/downloads'
		},
		exists: jest.fn(() => null)
	},
	fetch: jest.fn(() => null),
	config: jest.fn(() => null)
}));

jest.mock('react-native-file-viewer', () => ({
	open: jest.fn(() => null)
}));

jest.mock('expo-haptics', () => jest.fn(() => null));

jest.mock('./app/lib/database', () => jest.fn(() => null));

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
	...jest.requireActual('@react-navigation/native'),
	useNavigation: () => mockedNavigate
}));

jest.mock('react-native-notifications', () => ({
	Notifications: {
		getInitialNotification: jest.fn(() => Promise.resolve()),
		registerRemoteNotifications: jest.fn(),
		events: () => ({
			registerRemoteNotificationsRegistered: jest.fn(),
			registerRemoteNotificationsRegistrationFailed: jest.fn(),
			registerNotificationReceivedForeground: jest.fn(),
			registerNotificationReceivedBackground: jest.fn(),
			registerNotificationOpened: jest.fn()
		})
	}
}));

jest.mock('react-native-track-player', () => ({
	__esModule: true,
	default: {
		addEventListener: () => ({
			remove: jest.fn()
		}),
		registerEventHandler: jest.fn(),
		registerPlaybackService: jest.fn(),
		setupPlayer: jest.fn(),
		destroy: jest.fn(),
		updateOptions: jest.fn(),
		reset: jest.fn(),
		add: jest.fn(),
		remove: jest.fn(),
		skip: jest.fn(),
		skipToNext: jest.fn(),
		skipToPrevious: jest.fn(),
		removeUpcomingTracks: jest.fn(),
		play: jest.fn(),
		pause: jest.fn(),
		stop: jest.fn(),
		seekTo: jest.fn(),
		setVolume: jest.fn(),
		setRate: jest.fn(),
		getQueue: jest.fn(),
		getTrack: jest.fn(),
		getCurrentTrack: jest.fn(),
		getVolume: jest.fn(),
		getDuration: jest.fn(),
		getPosition: jest.fn(),
		getBufferedPosition: jest.fn(),
		getState: jest.fn(),
		getRate: jest.fn()
	},
	useProgress: () => ({
		position: 100
	})
}));

jest.mock('./app/containers/message/Components/Audio/tracksStorage.ts', () => ({
	useTracks: () => ['', jest.fn()]
}));
