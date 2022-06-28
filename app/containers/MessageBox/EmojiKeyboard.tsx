import React from 'react';
import { View } from 'react-native';
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard';

import { store } from '../../lib/store/auxStore';
import EmojiPicker from '../EmojiPicker';
import styles from './styles';
import { themes } from '../../lib/constants';
import { TSupportedThemes, withTheme } from '../../theme';
import { EventTypes } from '../EmojiPicker/interfaces';

interface IMessageBoxEmojiKeyboard {
	theme: TSupportedThemes;
}

export default class EmojiKeyboard extends React.PureComponent<IMessageBoxEmojiKeyboard, any> {
	private readonly baseUrl: string;

	constructor(props: IMessageBoxEmojiKeyboard) {
		super(props);
		const state = store.getState();
		this.baseUrl = state.share.server.server || state.server.server;
	}

	onItemClicked = (eventType: EventTypes, emoji: string | undefined) => {
		KeyboardRegistry.onItemSelected('EmojiKeyboard', { eventType, emoji });
	};

	render() {
		const { theme } = this.props;
		return (
			<View
				style={[styles.emojiKeyboardContainer, { borderTopColor: themes[theme].borderColor }]}
				testID='messagebox-keyboard-emoji'>
				<EmojiPicker onItemClicked={this.onItemClicked} baseUrl={this.baseUrl} isEmojiKeyboard={true} />
			</View>
		);
	}
}
KeyboardRegistry.registerKeyboard('EmojiKeyboard', () => withTheme(EmojiKeyboard));
