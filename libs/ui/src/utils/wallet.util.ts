import { Observable, withLatestFrom } from 'rxjs';

import { NETWORKS_DEFAULT_LIST } from '../constants/networks';
import { AccountInterface } from '../interfaces/account.interface';
import { NetworkInterface } from '../interfaces/network.interface';
import { initialAccount } from '../mocks/account.interface.mock';
import { WalletRootState } from '../store/wallet/wallet.state';

export const withSelectedAccount =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, AccountInterface] => {
        const { selectedAccountPublicKeyHash, accounts } = wallet;
        const selectedAccount =
          accounts.find(account => account.publicKeyHash === selectedAccountPublicKeyHash) ?? initialAccount;

        return [value, selectedAccount];
      })
    );

export const withSelectedNetwork =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, NetworkInterface] => {
        const selectedNetwork =
          wallet.networks.find(network => network.rpcUrl === wallet.selectedNetworkRpcUrl) ?? NETWORKS_DEFAULT_LIST[0];

        return [value, selectedNetwork];
      })
    );