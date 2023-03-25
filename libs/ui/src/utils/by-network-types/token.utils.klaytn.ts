import Caver from 'caver-js';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NetworkInterface } from '../../interfaces/network.interface';

export const loadKlaytnGasTokenBalance$ = ({ rpcUrl }: NetworkInterface, publicKeyHash: string): Observable<string> =>
  from(new Caver(rpcUrl).rpc.klay.getBalance(publicKeyHash)).pipe(map(balance => balance.toString()));
