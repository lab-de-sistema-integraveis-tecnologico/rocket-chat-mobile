import React from 'react';
import { Text } from 'react-native';

import shortnameToUnicode from '../../lib/methods/helpers/shortnameToUnicode';
import CustomEmoji from '../EmojiPicker/CustomEmoji';
import styles from './styles';
import { useTheme } from '../../theme';

interface IEmoji {
	literal: string;
	isMessageContainsOnlyEmoji: boolean;
	getCustomEmoji?: Function;
	baseUrl: string;
	customEmojis?: any;
	style?: object;
	onEmojiSelected?: Function;
	tabEmojiStyle?: object;
	testID: string;
}

const Emoji = React.memo(
	({ literal, isMessageContainsOnlyEmoji, getCustomEmoji, baseUrl, testID, customEmojis = true, style = {} }: IEmoji) => {
		const { colors } = useTheme();
		const emojiUnicode = shortnameToUnicode(literal);
		const emoji: any = getCustomEmoji && getCustomEmoji(literal.replace(/:/g, ''));
		if (emoji && customEmojis) {
			return (
				<CustomEmoji
					baseUrl={baseUrl}
					style={[isMessageContainsOnlyEmoji ? styles.customEmojiBig : styles.customEmoji, style]}
					emoji={emoji}
					testID={`${testID}-custom-emoji`}
				/>
			);
		}
		return (
			<Text
				style={[{ color: colors.bodyText }, isMessageContainsOnlyEmoji ? styles.textBig : styles.text, style]}
				testID={`${testID}-unicode-emoji`}>
				{emojiUnicode}
			</Text>
		);
	}
);

export default Emoji;
