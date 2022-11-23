import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC } from 'react';
import { ScrollView, Pressable, Linking, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { tabs } from 'webextension-polyfill';

import { AllowsBlock } from '../../../components/allows-block/allows-block';
import { Button } from '../../../components/button/button';
import { ButtonSizeEnum, ButtonThemesEnum } from '../../../components/button/enums';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { Row } from '../../../components/row/row';
import { Text } from '../../../components/text/text';
import { ScreensEnum, ScreensParamList } from '../../../enums/sreens.enum';
import { useNavigation } from '../../../hooks/use-navigation.hook';
import { AllowsRules } from '../../../interfaces/dapp-connection.interface';
import { useDAppSelector } from '../../../store/d-apps/d-apps.selectors';
import { changeNetworkAction } from '../../../store/wallet/wallet.actions';
import { useAllNetworksSelector, useSelectedNetworkSelector } from '../../../store/wallet/wallet.selectors';
import { handleCopyToClipboard } from '../../../utils/copy-to-clipboard.util';
import { createDAppResponse } from '../../../utils/dapp.utils';
import { eraseProtocol } from '../../../utils/string.util';
import { ModalContainer } from '../../components/modal-container/modal-container';
import { DAppImage } from '../d-app-connection-confirmation/d-app-image/d-app-image';

import { styles } from './network-change-confirmation.styles';

const changeNetworkRules: AllowsRules[] = [
  { text: 'Switch the Network', isAllowed: true },
  { text: 'Move funds without permissions', isAllowed: false }
];

export const NetworkChangeConfirmation: FC = () => {
  const { navigate } = useNavigation();
  const { name: selectedNetworkName } = useSelectedNetworkSelector();
  const networks = useAllNetworksSelector();
  const dispatch = useDispatch();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.NetworkChangeConfirmation>>();
  const dAppState = useDAppSelector(params.dAppOrigin);

  const navigateToWalletScreen = () => navigate(ScreensEnum.Wallet);
  const copy = () => handleCopyToClipboard(dAppState.origin);
  const dappsNetwork = networks.find(
    network => network.chainId === parseInt(params.requestedChainId.substring(2), 16).toString()
  );

  const acceptChangeNetwork = () => {
    const decimalChainId = parseInt(params.requestedChainId.substring(2), 16);
    dispatch(changeNetworkAction(decimalChainId.toString()));
    tabs.query({ active: true }).then(queryTabs => {
      if (queryTabs[0].id !== undefined) {
        const message = createDAppResponse(params.messageId, null);
        tabs.sendMessage(queryTabs[0].id, message);

        setTimeout(window.close, 1000);
      }
    });
  };

  return (
    <ModalContainer screenTitle="Confirm change network">
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        <Row style={styles.dappLogo}>
          <DAppImage imageUri={dAppState.favicon} />
        </Row>
        <Row style={styles.addressRow}>
          <Text style={styles.smallText}>Address</Text>
          <Row>
            <Text style={styles.explorerLink} onPress={() => Linking.openURL(dAppState.origin)} numberOfLines={1}>
              {eraseProtocol(dAppState.origin)}
            </Text>
            <Pressable onPress={copy}>
              <Icon name={IconNameEnum.Copy} />
            </Pressable>
          </Row>
        </Row>
        <View style={styles.divider} />
        <Row style={styles.chainChange}>
          <DAppImage />
          <Icon name={IconNameEnum.ArrowRight} />
          <DAppImage />
        </Row>
        <View>
          <Text style={styles.grayText}>From</Text>
          <Row style={styles.chainSelector}>
            <DAppImage size={ButtonSizeEnum.Small} />
            <Text style={styles.chainName}>{selectedNetworkName}</Text>
          </Row>
        </View>
        <View style={styles.addressTo}>
          <Text style={styles.grayText}>To</Text>
          <Row style={styles.chainSelector}>
            <DAppImage size={ButtonSizeEnum.Small} />
            <Text style={styles.chainName}>{dappsNetwork?.name}</Text>
          </Row>
        </View>
        <AllowsBlock rules={changeNetworkRules} />
      </ScrollView>
      <Row style={styles.buttonPanel}>
        <Button onPress={navigateToWalletScreen} theme={ButtonThemesEnum.Primary} title="Decline" />
        <Button theme={ButtonThemesEnum.Secondary} title="Confirm" onPress={acceptChangeNetwork} />
      </Row>
    </ModalContainer>
  );
};