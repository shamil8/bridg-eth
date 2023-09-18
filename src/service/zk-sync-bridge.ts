import { parseEther, } from 'ethers';

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

    /** Send from ZkSync to ETH */
    try {
      const trx = await this.zkSyncProvider.fromZkSyncToEth('0xe2a5CB5176d5d315Cdaa4a1dE470A4e34076310f', '0.0044');

      console.log('ZkSyncContractTransaction info', trx.hash);
    }
    catch (e) {
      console.log('Error in fromZkSyncToEth', e);
    }

    /** Send from ETH to ZkSync */
    try {
      const trx = await this.ethToZkSync(
        '0x7Ea3a32a418C9dDD29EBa341545B67ac8D373072',
        '0.0007'
      );

      console.log('Eth Transaction ethToZkSync', trx.hash);
    }
    catch (e) {
      console.log('Error in ethToZkSync', e);
    }
  }

  async ethToZkSync(receiverAddress: string, amount: string) {
    const l2Value = parseEther(amount);
    let l2GasLimit: bigint;

    try {
      l2GasLimit = await this.zkSyncProvider.estimateGasL1({
        from: receiverAddress,
        to: receiverAddress,
        data: '',
      });
    }
    catch (e) {
      throw Error(`Error in estimateGasL1: ${e}`);
    }

    return this.ethProvider.fromEthToZkSync(receiverAddress, l2Value, l2GasLimit);
  }
}
