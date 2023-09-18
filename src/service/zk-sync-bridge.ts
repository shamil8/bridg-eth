import { ZkSyncProvider, } from '../providers/zk-sync-provider';
import { EthProvider, } from '../providers/eth-provider';

export class ZkSyncBridge {
  private readonly zkSyncProvider: ZkSyncProvider;

  private readonly ethProvider: EthProvider;

  constructor() {
    this.zkSyncProvider = new ZkSyncProvider();
    this.ethProvider = new EthProvider();
  }

  async run(): Promise<void> {
    try {
      const blockNumber = await this.zkSyncProvider.getBlockNumber();
      const ethBlockNumber = await this.ethProvider.getBlockNumber();

      console.log('zkSync__blockNumber', blockNumber);
      console.log('eth__BlockNumber', ethBlockNumber);
    }
    catch (e) {
      console.log('Error in getBlockNumber', e);
    }

    try {
      const trx = await this.zkSyncProvider.fromZkSyncToEth('0xe2a5CB5176d5d315Cdaa4a1dE470A4e34076310f', '0.0044');

      console.log('ZkSyncContractTransaction info', trx.hash);
    }
    catch (e) {
      console.log('Error in fromZkSyncToEth', e);
    }

    try {
      const trx = await this.ethProvider.fromEthToZkSync(
        '0x7Ea3a32a418C9dDD29EBa341545B67ac8D373072',
        '0.00666'
      );

      console.log('Eth Transaction estimateGas', trx);
    }
    catch (e) {
      console.log('Error in estimateGas', e);
    }
  }
}
