import { resolveProperties, TransactionRequest, } from 'ethers';
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

  async estimateGasL1(transaction: TransactionRequest): Promise<bigint> {
    const params = await resolveProperties({
      // eslint-disable-next-line no-underscore-dangle
      transaction: this.provider._getTransactionRequest(transaction),
    });

    if (transaction.customData != null) {
      params.transaction.customData = transaction.customData;
    }

    try {
      const result = await this.provider.send('zks_estimateGasL1ToL2', [params.transaction]);

      return BigInt(result);
    }
    catch (err) {
      throw new Error(`bad result from backend (zks_estimateGasL1ToL2): ${err}`);
    }
  }
}
