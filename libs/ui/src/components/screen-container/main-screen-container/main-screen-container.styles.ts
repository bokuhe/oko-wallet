import { StyleSheet } from 'react-native';

import { colors } from '../../../styles/colors';
import { EXTENSION_FULL_SIZE, getCustomSize } from '../../../styles/format-size';
import { isMobile, isWeb } from '../../../utils/platform.utils';
import { contentHeight } from '../constants';

export const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: isWeb ? EXTENSION_FULL_SIZE : '100%',
    backgroundColor: colors.bgGrey1,
    borderBottomLeftRadius: getCustomSize(3),
    borderBottomRightRadius: getCustomSize(3)
  },
  qrCodeWrapper: {
    position: 'relative',
    marginBottom: getCustomSize(2),
    paddingBottom: getCustomSize(2),
    paddingHorizontal: getCustomSize(2),
    backgroundColor: colors.bgGrey2,
    borderBottomLeftRadius: getCustomSize(3),
    borderBottomRightRadius: getCustomSize(3)
  },
  layout: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: '100%',
    height: getCustomSize(75),
    backgroundColor: colors.bgGrey2
  },
  contentContainer: {
    minHeight: contentHeight,
    flexShrink: 0,
    ...(isMobile && { paddingTop: getCustomSize(7) })
  },
  container: {
    marginTop: getCustomSize(-7),
    ...(isWeb && { paddingTop: getCustomSize(7) })
  },
  content: {
    padding: getCustomSize(2)
  },
  contentPadding: {
    marginTop: getCustomSize(-7),
    paddingTop: getCustomSize(7),
    zIndex: -1
  }
});
