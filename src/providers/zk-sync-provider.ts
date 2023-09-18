import { TransactionResponse, } from 'ethers/src.ts/providers/provider';

import config from '../config';
import { ZkSyncContract, } from '../contracts/zk-sync-contract';
import { NetworkProvider, } from './network-provider';

export class ZkSyncProvider extends NetworkProvider {
  public readonly zkSyncContract: ZkSyncContract;

  constructor() {
    super(config.zkSyncProvider);

    this.zkSyncContract = new ZkSyncContract(this.provider);
  }

  async fromZkSyncToEth(receiverAddress: string, amount: string): Promise<TransactionResponse> {
    return this.zkSyncContract.withdraw(this.signer, receiverAddress, amount);
  }
}
