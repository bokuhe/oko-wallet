import { StyleSheet } from 'react-native';

import { getCustomSize } from '../../../styles/format-size';

export const styles = StyleSheet.create({
  icon: {
    marginRight: getCustomSize(2)
  },
  accountBalance: {
    marginLeft: 'auto'
  },
  qrCode: {
    marginTop: getCustomSize(2.5)
  }
});