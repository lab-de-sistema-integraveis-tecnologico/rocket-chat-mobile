import React from 'react';
import { View } from 'react-native';
import { Q } from '@nozbe/watermelondb';

import EmojiPicker from '../../containers/EmojiPicker';
import { useTheme } from '../../theme';
import styles from './styles';
import { IApplicationState } from '../../definitions';
import { EventTypes } from '../../containers/EmojiPicker/interfaces';
import { useAppSelector } from '../../lib/hooks';
import { FormTextInput } from '../../containers/TextInput/FormTextInput';
import I18n from '../../i18n';
import { sanitizeLikeString } from '../../lib/database/utils';
import { emojis } from '../../containers/EmojiPicker/emojis';
import database from '../../lib/database';
import { debounce } from '../../lib/methods/helpers/debounce';

interface IReactionPickerProps {
	message?: any;
	show: boolean;
	reactionClose: () => void;
	onEmojiSelected: (shortname: string, id: string) => void;
	width: number;
	height: number;
}

const MAX_EMOJIS_TO_DISPLAY = 20;

const ReactionPicker = React.memo(({ onEmojiSelected, message, reactionClose }: IReactionPickerProps) => {
	const { colors } = useTheme();
	const [searchText, setSearchText] = React.useState<string>('');
	const [searchedEmojis, setSearchedEmojis] = React.useState<any[]>([]);
	const [searching, setSearching] = React.useState<boolean>(false);
	const baseUrl = useAppSelector((state: IApplicationState) => state.server?.server);

	const handleTextChange = (text: string) => {
		setSearching(text !== '');
		setSearchText(text);
		searchEmojis(text);
	};

	const searchEmojis = debounce(async (keyword: string) => {
		const likeString = sanitizeLikeString(keyword);
		const whereClause = [];
		if (likeString) {
			whereClause.push(Q.where('name', Q.like(`${likeString}%`)));
		}
		const db = database.active;
		const customEmojisCollection = db.get('custom_emojis');
		const customEmojis = await (await customEmojisCollection.query(...whereClause).fetch()).slice(0, MAX_EMOJIS_TO_DISPLAY / 2);
		const filteredEmojis = emojis.filter(emoji => emoji.indexOf(keyword) !== -1).slice(0, MAX_EMOJIS_TO_DISPLAY / 2);
		const mergedEmojis = [...customEmojis, ...filteredEmojis];
		setSearchedEmojis(mergedEmojis);
	}, 300);

	const handleEmojiSelect = (_eventType: EventTypes, emoji?: string, shortname?: string) => {
		// standard emojis: `emoji` is unicode and `shortname` is :joy:
		// custom emojis: only `emoji` is returned with shortname type (:joy:)
		// to set reactions, we need shortname type
		if (message) {
			// @ts-ignore
			onEmojiSelected(shortname || emoji, message.id);
		}
		reactionClose();
	};

	return (
		<View style={[styles.reactionPickerContainer]} testID='reaction-picker'>
			<View style={styles.searchbarContainer}>
				<FormTextInput
					autoCapitalize='none'
					autoCorrect={false}
					blurOnSubmit
					placeholder={I18n.t('Search_emoji')}
					returnKeyType='search'
					underlineColorAndroid='transparent'
					onChangeText={handleTextChange}
					style={[styles.reactionPickerSearchbar, { backgroundColor: colors.passcodeButtonActive }]}
					value={searchText}
					onClearInput={() => handleTextChange('')}
					iconRight={'search'}
				/>
			</View>
			<EmojiPicker onItemClicked={handleEmojiSelect} baseUrl={baseUrl} searching={searching} searchedEmojis={searchedEmojis} />
		</View>
	);
});

export default ReactionPicker;
