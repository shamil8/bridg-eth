import {
  Contract, JsonRpcProvider, Wallet, parseEther,
} from 'ethers';
import { TransactionResponse, } from 'ethers/src.ts/providers/provider';

import { zkSyncContractAbi, } from './zk-sync-contract.abi';
import config from '../config';

export class ZkSyncContract {
  public readonly abi = zkSyncContractAbi;

  public readonly address: string;

  public readonly contract: Contract;

  constructor(private readonly provider: JsonRpcProvider) {
    if (!config.zkSyncContractAddress) {
      throw new Error('Can not find ZK_SYNC_CONTRACT_ADDRESS');
    }

    this.address = config.zkSyncContractAddress;

    this.contract = new Contract(this.address, this.abi, this.provider);
  }

  /**
   * Get balance for this account address
   *
   * @param {string} _account
   * @returns {Promise<bigint>}
   */
  async balanceOf(
    _account: string
  ): Promise<bigint> {
    return this.contract.balanceOf(_account);
  }

  /**
   * Get bridge contract decimals
   *
   * @returns {Promise<bigint>}
   */
  async decimals(): Promise<bigint> {
    return this.contract.decimals();
  }

  /**
   * Get bridge contract name
   *
   * @returns {Promise<string>}
   */
  async name(): Promise<string> {
    return this.contract.name();
  }

  /**
   * Get contract symbol
   *
   * @returns {Promise<string>}
   */
  async symbol(): Promise<string> {
    return this.contract.symbol();
  }

  /**
   * Get contract totalSupply
   *
   * @returns {Promise<string>}
   */
  async totalSupply(): Promise<string> {
    return this.contract.totalSupply();
  }

  /**
   * Create withdrawal transaction from zkSync to  Eth
   *
   * @param {Wallet} signer
   * @param {string} _l1Receiver
   * @param {string} amount
   * @returns {Promise<TransactionResponse>}
   */
  public async withdraw(
    signer: Wallet,
    _l1Receiver: string,
    amount: string
  ): Promise<TransactionResponse> {
    const contract = this.contract.connect(signer) as Contract;

    return contract.withdraw(_l1Receiver, { value: parseEther(amount), });
  }
}
