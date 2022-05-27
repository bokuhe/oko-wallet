import { TezosToolkit } from '@taquito/taquito';
import { getDefaultProvider } from 'ethers';
import { from, map, Observable } from 'rxjs';

import { NetworkInterface } from '../interfaces/network.interface';

export const getGasTokenBalance$ = (network: NetworkInterface, pkh: string): Observable<string> => {
  const { rpcUrl, name: networkName } = network;

  // TODO: How to define check tezos network
  if (networkName === 'Tezos') {
    // TODO: Delete later
    const tzAddress = 'tz1XstX8fYXPY5JNV6M2p1yLD6VNjX38YuQP';

    const tezosToolkit = new TezosToolkit(rpcUrl);

    return from(tezosToolkit.tz.getBalance(tzAddress)).pipe(map(balance => balance.toFixed()));
  }

  const provider = getDefaultProvider(rpcUrl);

  return from(provider.getBalance(pkh)).pipe(map(balance => balance.toString()));
};