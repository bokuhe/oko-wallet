import { StyleSheet } from 'react-native';

import { colors } from '../../styles/colors';
import { getCustomSize } from '../../styles/format-size';
import { typography } from '../../styles/typography';
import { isWeb } from '../../utils/platform.utils';

export const styles = StyleSheet.create({
  labelContainer: {
    paddingLeft: getCustomSize(),
    marginBottom: getCustomSize(0.75)
  },
  label: {
    color: colors.textGrey3,
    ...typography.captionInterRegular13
  },
  input: {
    ...typography.bodyInterRegular15,
    borderRadius: getCustomSize(),
    borderWidth: 1,
    backgroundColor: colors.bgGrey4,
    borderColor: colors.bgGrey4,
    color: colors.textGrey1,
    paddingVertical: getCustomSize(1.75),
    paddingHorizontal: getCustomSize(1.5),
    ...(isWeb && { outlineStyle: 'none' })
  },
  errorInput: {
    borderColor: colors.red
  },
  textError: {
    marginTop: getCustomSize(),
    color: colors.red,
    ...typography.captionInterRegular11
  }
});
