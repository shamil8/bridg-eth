import {
  Contract, JsonRpcProvider, Wallet, parseEther,
} from 'ethers';
import { TransactionResponse, } from 'ethers/src.ts/providers/provider';

import { ContractTransaction, } from 'ethers/src.ts/contract/types';
import config from '../config';
import { ethContractAbi, } from './eth-contract.abi';

export class EthContract {
  public readonly abi = ethContractAbi;

  public readonly address: string;

  private readonly contract: Contract;

  constructor(private readonly provider: JsonRpcProvider) {
    if (!config.ethContractAddress) {
      throw new Error('Can not find ETH_CONTRACT_ADDRESS');
    }

    this.address = config.ethContractAddress;

    this.contract = new Contract(this.address, this.abi, this.provider);
  }

  /**
   * Get balance for this account address
   *
   * @param {bytes32} _l2TxHash
   * @param {uint256} _l2BlockNumber
   * @param {uint256} _l2MessageIndex
   * @param {uint16} _l2TxNumberInBlock
   * @param {bytes32[]} _merkleProof
   * @param {uint8} _status
   * @returns {Promise<boolean>}
   */
  async proveL1ToL2TransactionStatus(
    _l2TxHash: string,
    _l2BlockNumber: string,
    _l2MessageIndex: string,
    _l2TxNumberInBlock: string,
    _merkleProof: string,
    _status: string
  ): Promise<boolean> {
    return this.contract.proveL1ToL2TransactionStatus(
      _l2TxHash,
      _l2BlockNumber,
      _l2MessageIndex,
      _l2TxNumberInBlock,
      _merkleProof,
      _status
    );
  }

  /**
   * Expected L2 transaction cost
   *
   * @param {bytes32} _gasPrice
   * @param {uint256} _l2GasLimit
   * @param {uint256} _l2GasPerPubdataByteLimit
   * @returns {Promise<string>}
   */
  async l2TransactionBaseCost(
    _gasPrice: bigint,
    _l2GasLimit: bigint,
    _l2GasPerPubdataByteLimit: number
  ): Promise<bigint> {
    return this.contract.l2TransactionBaseCost(
      _gasPrice,
      _l2GasLimit,
      _l2GasPerPubdataByteLimit
    );
  }

  /**
   * Create request l2 transaction
   *
   * @param {Wallet} signer
   * @param {address} _contractL2
   * @param {uint256} _l2Value
   * @param {bytes} _calldata
   * @param {uint256} _l2GasLimit
   * @param {uint256} _l2GasPerPubdataByteLimit
   * @param {bytes[]} _factoryDeps
   * @param {address} _refundRecipient
   * @param {bigint} value
   * @returns {Promise<TransactionResponse>}
   */
  public async requestL2Transaction(
    signer: Wallet,
    _contractL2: string,
    _l2Value: string,
    _calldata: Buffer,
    _l2GasLimit: bigint,
    _l2GasPerPubdataByteLimit: number,
    _factoryDeps: string[],
    _refundRecipient: string,
    value: bigint
  ): Promise<TransactionResponse> {
    const contract = this.contract.connect(signer) as Contract;

    return contract.requestL2Transaction(
      _contractL2,
      parseEther(_l2Value),
      _calldata,
      _l2GasLimit,
      _l2GasPerPubdataByteLimit,
      _factoryDeps,
      _refundRecipient,
      { value, }
    );
  }

  async populateTrx(
    signer: Wallet,
    _contractL2: string,
    _l2Value: string,
    _calldata: Buffer,
    _l2GasLimit: bigint,
    _l2GasPerPubdataByteLimit: number,
    _factoryDeps: string[],
    _refundRecipient: string,
    amount: string
  ): Promise<ContractTransaction> {
    const baseMethod = this.contract.requestL2Transaction;

    return baseMethod.populateTransaction(
      _contractL2,
      parseEther(_l2Value),
      _calldata,
      _l2GasLimit,
      _l2GasPerPubdataByteLimit,
      _factoryDeps,
      _refundRecipient,
      { value: parseEther(amount), }
    );
  }
}
