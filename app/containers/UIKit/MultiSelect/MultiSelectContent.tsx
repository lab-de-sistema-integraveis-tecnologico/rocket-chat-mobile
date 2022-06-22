import React, { useState } from 'react';
import { View } from 'react-native';

import FormTextInput from '../../TextInput/FormTextInput';
import { textParser } from '../utils';
import I18n from '../../../i18n';
import Items from './Items';
import styles from './styles';
import { useTheme, TSupportedThemes } from '../../../theme';
import { IItemData } from '.';

interface IMultiSelectContentProps {
	onSearch?: () => void;
	options?: IItemData[];
	theme: TSupportedThemes;
	multiselect: boolean;
	select: React.Dispatch<any>;
	onChange: Function;
	setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
	onHide: Function;
	selectedItems: any;
}

export const MultiSelectContent = React.memo(
	({
		onSearch,
		options,
		theme,
		multiselect,
		select,
		onChange,
		setCurrentValue,
		onHide,
		selectedItems
	}: IMultiSelectContentProps) => {
		const { colors } = useTheme();
		const [selected, setSelected] = useState<any>(Array.isArray(selectedItems) ? selectedItems : []);
		const [search, onSearchChange] = useState('');

		const onSelect = (item: IItemData) => {
			const {
				value,
				text: { text }
			} = item;
			if (multiselect) {
				let newSelect = [];
				if (!selected.includes(value)) {
					newSelect = [...selected, value];
				} else {
					newSelect = selected.filter((s: any) => s !== value);
				}
				setSelected(newSelect);
				select(newSelect);
			} else {
				onChange({ value });
				setCurrentValue(text);
				onHide();
			}
		};

		const items: any = onSearch
			? options
			: options?.filter((option: any) => textParser([option.text]).toLowerCase().includes(search.toLowerCase()));

		return (
			<View style={[styles.actionSheetContainer, { backgroundColor: colors.backgroundColor }]}>
				<FormTextInput
					testID='multi-select-search'
					onChangeText={onSearch || onSearchChange}
					placeholder={I18n.t('Search')}
					theme={theme}
				/>
				<Items items={items} selected={selected} onSelect={onSelect} theme={theme} />
			</View>
		);
	}
);
