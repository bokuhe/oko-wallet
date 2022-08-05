import { OnEventFn } from '@rnw-community/shared';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, ControllerRenderProps, FieldValues, FieldPath } from 'react-hook-form';
import { GestureResponderEvent } from 'react-native';

import { EMPTY_STRING } from '../../constants/defaults';
import { IconNameEnum } from '../icon/icon-name.enum';
import { Row } from '../row/row';
import { TextInput } from '../text-input/text-input';
import { TouchableIcon } from '../touchable-icon/touchable-icon';

import { styles } from './search-panel.styles';

const SEARCH_FIELD = 'search';

interface Props {
  setSearchValue: OnEventFn<string>;
  onPressAddIcon: OnEventFn<GestureResponderEvent>;
  onPressEditIcon?: OnEventFn<GestureResponderEvent>;
  onPressActivityIcon?: OnEventFn<GestureResponderEvent>;
  selectedItem?: string;
  onSearchClose?: () => void;
}

const renderTextInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  field: ControllerRenderProps<TFieldValues, TName>
) => <TextInput field={field} placeholder="Search" containerStyle={styles.inputContainer} inputStyle={styles.input} />;

export const SearchPanel: React.FC<Props> = ({
  setSearchValue,
  onPressAddIcon,
  selectedItem,
  onPressEditIcon,
  onPressActivityIcon,
  onSearchClose
}) => {
  const [isShowSearchField, setIsShowSearchField] = useState(false);

  const { control, resetField, watch, setFocus } = useForm({
    mode: 'onChange',
    defaultValues: {
      search: EMPTY_STRING
    }
  });

  const searchValue = watch(SEARCH_FIELD);

  useEffect(() => {
    setSearchValue(searchValue);
  }, [searchValue, setSearchValue]);

  useEffect(() => {
    if (isShowSearchField) {
      setFocus(SEARCH_FIELD);
    }
  }, [isShowSearchField]);

  const hideSearchField = useCallback(() => {
    setIsShowSearchField(false);
    resetField(SEARCH_FIELD);
    onSearchClose?.();
  }, [onSearchClose]);

  const showSearchField = () => setIsShowSearchField(true);

  useEffect(() => {
    if (selectedItem !== undefined) {
      hideSearchField();
    }
  }, [selectedItem]);

  return (
    <Row style={styles.root}>
      {isShowSearchField ? (
        <>
          <Controller control={control} name={SEARCH_FIELD} render={({ field }) => renderTextInput(field)} />
          <TouchableIcon name={IconNameEnum.X} onPress={hideSearchField} style={styles.close} />
        </>
      ) : (
        <>
          <TouchableIcon name={IconNameEnum.Search} onPress={showSearchField} />
          <Row>
            <TouchableIcon name={IconNameEnum.Add} onPress={onPressAddIcon} />
            {onPressEditIcon && (
              <TouchableIcon style={styles.extraIcon} name={IconNameEnum.Edit} onPress={onPressEditIcon} />
            )}
            {onPressActivityIcon && (
              <TouchableIcon style={styles.extraIcon} name={IconNameEnum.Activity} onPress={onPressActivityIcon} />
            )}
          </Row>
        </>
      )}
    </Row>
  );
};