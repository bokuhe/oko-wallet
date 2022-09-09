import { RouteProp, useRoute } from '@react-navigation/native';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC } from 'react';

import { Divider } from '../../components/divider/divider';
import { ScreenTitle } from '../../components/screen-components/header-container/components/screen-title/screen-title';
import { HeaderContainer } from '../../components/screen-components/header-container/header-container';
import { ScreenContainer } from '../../components/screen-components/screen-container/screen-container';
import { Tabs } from '../../components/tabs/tabs';
import { GAS_TOKEN_ADDRESS } from '../../constants/defaults';
import { ScreensEnum, ScreensParamList } from '../../enums/sreens.enum';
import { useNavigation } from '../../hooks/use-navigation.hook';
import { ViewStyleProps } from '../../interfaces/style.interface';
import { useTokenBalanceSelector } from '../../store/wallet/wallet.selectors';
import { getTokenSlug } from '../../utils/token.utils';

import { Activity } from './components/activity/activity';
import { Balance } from './components/balance/balance';
import { HeaderSideToken } from './components/header-side-token/header-side-token';
import { NavigationBar } from './components/navigation-bar/navigation-bar';
import { TokenInfo } from './components/token-info/token-info';
import { styles } from './token.styles';

interface Props {
  style?: ViewStyleProps;
}

const tabs = [
  {
    id: 1,
    title: 'Activity',
    Component: Activity
  },
  {
    id: 2,
    title: 'Info',
    Component: TokenInfo
  }
];

export const Token: FC<Props> = ({ style }) => {
  const { goBack } = useNavigation();
  const {
    params: { token }
  } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Token>>();

  const { name, symbol, tokenAddress, decimals, tokenId, thumbnailUri, balance } = token;

  const balanceFromStore = useTokenBalanceSelector(getTokenSlug(tokenAddress, tokenId));
  const formattedBalance = formatUnits(balanceFromStore ?? balance.data, decimals);
  const isGasToken = tokenAddress === GAS_TOKEN_ADDRESS;

  return (
    <ScreenContainer style={[styles.root, style]}>
      <HeaderContainer isSelectors>
        <ScreenTitle title={symbol} onBackButtonPress={goBack} />
        <HeaderSideToken
          name={name}
          dynamics="20.43"
          price="0.34"
          thumbnailUri={thumbnailUri}
          isGasToken={isGasToken}
        />
      </HeaderContainer>

      <Balance balance={formattedBalance} />
      <NavigationBar token={token} />

      <Divider style={styles.divider} />

      <Tabs values={tabs} style={styles.tabs} />
    </ScreenContainer>
  );
};