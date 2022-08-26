import { OnEventFn } from '@rnw-community/shared';
import React from 'react';
import { View, FlatList, FlatListProps, GestureResponderEvent } from 'react-native';

import { EmptySearchIcon } from '../icon/components/empty-search-icon/empty-search-icon';
import { SearchPanel } from '../search-panel/search-panel';

import { useFlatListRef } from './hooks/use-flat-list-ref.hook';
import { styles } from './selector.styles';
import { getItemLayout as getItemLayoutBase } from './utils/get-item-layout.util';

interface Props<T extends object> extends Pick<FlatListProps<T>, 'renderItem' | 'keyExtractor' | 'getItemLayout'> {
  selectedItemName: string;
  onPressAddIcon?: OnEventFn<GestureResponderEvent>;
  setSearchValue: OnEventFn<string>;
  data: T[];
  selectedIndex: number;
  isSearchInitiallyOpened?: boolean;
}

export const Selector = <T extends object>({
  data,
  renderItem,
  onPressAddIcon,
  setSearchValue,
  keyExtractor,
  selectedItemName,
  selectedIndex,
  isSearchInitiallyOpened,
  getItemLayout = getItemLayoutBase
}: Props<T>) => {
  const { flatListRef } = useFlatListRef({ data, selectedIndex });

  return (
    <View style={styles.root}>
      <SearchPanel
        onPressAddIcon={onPressAddIcon}
        setSearchValue={setSearchValue}
        selectedItemName={selectedItemName}
        isSearchInitiallyOpened={isSearchInitiallyOpened}
      />

      <FlatList
        ref={flatListRef}
        getItemLayout={getItemLayout}
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<EmptySearchIcon />}
      />
    </View>
  );
};