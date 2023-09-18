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

  async checkProvidersConnection(): Promise<{ zkSync: number, eth: number }> {
    const zkSync = await this.zkSyncProvider.getBlockNumber();
    const eth = await this.ethProvider.getBlockNumber();

    return { zkSync, eth, };
  }

  /**
   * Send from ETH to ZkSync
   *
   * @param {string} receiverAddress
   * @param {string} amount
   * @returns {Promise<string>}
   */
  async ethToZkSync(receiverAddress: string, amount: string): Promise<string> {
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

    try {
      const trx = await this.ethProvider
        .fromEthToZkSync(receiverAddress, l2Value, l2GasLimit);

      return trx.hash;
    }
    catch (e) {
      throw Error(`Error in fromEthToZkSync: ${e}`);
    }
  }

  /**
   * Send from ZkSync to Eth
   *
   * @param {string} receiverAddress
   * @param {string} amount
   * @returns {Promise<string>}
   */
  async zkSyncToEth(receiverAddress: string, amount: string): Promise<string> {
    const value = parseEther(amount);

    try {
      const trx = await this.zkSyncProvider.fromZkSyncToEth(receiverAddress, value);

      return trx.hash;
    }
    catch (e) {
      throw Error(`Error in fromZkSyncToEth: ${e}`);
    }
  }
}
