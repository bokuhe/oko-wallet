import { TransactionResponse } from '@ethersproject/abstract-provider';
import { isDefined } from '@rnw-community/shared';
import React, { FC, useCallback } from 'react';

import { sendErrorToDAppAndClosePopup, sendResponseToDAppAndClosePopup } from '../../../..//utils/dapp.utils';
import { AssetTypeEnum } from '../../../../enums/asset-type.enum';
import { useNavigation } from '../../../../hooks/use-navigation.hook';
import { useShelter } from '../../../../hooks/use-shelter.hook';
import { TransactionParams } from '../../../../shelter/interfaces/get-evm-signer-params.interface';
import {
  useSelectedAccountPublicKeyHashSelector,
  useSelectedNetworkSelector
} from '../../../../store/wallet/wallet.selectors';
import { getAssetType } from '../../../../utils/get-asset-type.util';
import { useTransactionHook } from '../../hooks/use-transaction.hook';
import { EvmTransferParams, OnSend } from '../../types';
import { Confirmation } from '../confirmation/confirmation';

import { useEvmEstimations } from './hooks/use-evm-estimations.hook';
import { getAmount } from './utils/get-amount.util';

interface Props {
  transferParams: EvmTransferParams;
  messageID?: string;
}

export const EvmConfirmation: FC<Props> = ({
  transferParams: { asset, receiverPublicKeyHash, value, data = '0x' },
  messageID,
  children
}) => {
  const publicKeyHash = useSelectedAccountPublicKeyHashSelector();
  const network = useSelectedNetworkSelector();
  const { sendEvmTransaction } = useShelter();
  const { goBack } = useNavigation();
  const { isTransactionLoading, setIsTransactionLoading, successCallback, errorCallback } =
    useTransactionHook(receiverPublicKeyHash);

  const { tokenAddress, tokenId, decimals, symbol } = asset;
  const assetType = getAssetType(asset);

  const { estimations, isLoading } = useEvmEstimations({
    network,
    asset,
    receiverPublicKeyHash,
    value,
    publicKeyHash,
    assetType
  });

  const { rpcUrl } = network;
  const transactionFee = isDefined(estimations?.gasPrice)
    ? Number(estimations?.gasPrice) * Number(estimations?.gasLimit)
    : 0;

  const customSuccessCallback = (transactionResponse: TransactionResponse) => {
    successCallback(transactionResponse);

    // if messageID defined, its dApp confirmation and we need to send message and close window after success confirm
    if (isDefined(messageID)) {
      sendResponseToDAppAndClosePopup(messageID, transactionResponse.hash);
    }
  };

  const onSend: OnSend = useCallback(
    gasPriceCoefficient => {
      if (isDefined(estimations?.gasPrice) && typeof gasPriceCoefficient === 'number') {
        setIsTransactionLoading(true);

        const transactionParams: TransactionParams = {
          gasPrice: Math.trunc(Number(estimations?.gasPrice) * gasPriceCoefficient),
          gasLimit: Number(estimations?.gasLimit),
          receiverPublicKeyHash,
          tokenAddress,
          tokenId,
          data,
          ...(assetType !== AssetTypeEnum.Collectible && {
            value: getAmount(value, decimals)
          })
        };

        sendEvmTransaction({
          rpcUrl,
          transactionParams,
          publicKeyHash,
          assetType,
          successCallback: customSuccessCallback,
          errorCallback
        });
      }
    },
    [estimations]
  );

  const onDecline = () => {
    if (isDefined(messageID)) {
      sendErrorToDAppAndClosePopup(messageID);
    }

    goBack();
  };

  return (
    <Confirmation
      isFeeLoading={isLoading}
      onSend={onSend}
      onDecline={onDecline}
      isTransactionLoading={isTransactionLoading}
      receiverPublicKeyHash={receiverPublicKeyHash}
      amount={value}
      symbol={symbol}
      initialTransactionFee={transactionFee}
      children={children}
    />
  );
};
