import React, { FC } from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

import { ViewStyleProps } from '../../interfaces/style.interface';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { styles } from './button.styles';
import { sizeClasses, themeClasses } from './constants';

interface Props extends PressableProps {
  title: string;
  theme?: keyof typeof themeClasses;
  size?: keyof typeof sizeClasses;
  rightIcon?: IconNameEnum;
  leftIcon?: IconNameEnum;
  iconSize?: number;
  style?: ViewStyleProps;
  disabled?: boolean;
}

export const Button: FC<Props> = ({
  title,
  theme = 'primary',
  size = 'extraLarge',
  rightIcon,
  leftIcon,
  iconSize,
  style,
  disabled = false,
  ...restProps
}) => (
  <Pressable
    {...restProps}
    disabled={disabled}
    style={[styles.root, themeClasses[theme].button, sizeClasses[size], disabled && styles.disabledButton, style]}
  >
    <View style={styles.wrapper}>
      {leftIcon && <Icon name={leftIcon} size={iconSize} iconStyle={styles.leftIcon} />}
      <Text style={[styles.text, themeClasses[theme].text, disabled && styles.disabledText]}>{title}</Text>
      {rightIcon && <Icon name={rightIcon} size={iconSize} iconStyle={styles.rightIcon} />}
    </View>
  </Pressable>
);
