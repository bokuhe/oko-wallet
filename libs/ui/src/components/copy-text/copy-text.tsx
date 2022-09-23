import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { TextStyleProps } from '../../interfaces/style.interface';
import { handleCopyToClipboard } from '../../utils/copy-to-clipboard.util';
import { shortize } from '../../utils/shortize.util';
import { Text } from '../text/text';

import { styles } from './copy-text.styles';

interface Props {
  text: string;
  isShortize?: boolean;
  numberOfLines?: number;
  style?: TextStyleProps;
}

export const CopyText: FC<Props> = ({ text, isShortize = true, numberOfLines, style }) => {
  const copy = () => handleCopyToClipboard(text);

  return (
    <TouchableOpacity onPress={copy} style={[styles.root, style]}>
      <Text style={styles.text} numberOfLines={numberOfLines}>
        {isShortize ? shortize(text) : text}
      </Text>
    </TouchableOpacity>
  );
};
