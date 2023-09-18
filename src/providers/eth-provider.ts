import { parseEther, } from 'ethers';
import { TransactionResponse, } from 'ethers/src.ts/providers/provider';

import { ContractTransaction, } from 'ethers/src.ts/contract/types';
import config from '../config';
import { NetworkProvider, } from './network-provider';
import { EthContract, } from '../contracts/eth-contract';
import { RECOMMENDED_DEPOSIT_L2_GAS_LIMIT, REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT, } from '../config/zk-sync';

export class EthProvider extends NetworkProvider {
  private readonly ethContract: EthContract;

  constructor() {
    super(config.ethProvider);

    this.ethContract = new EthContract(this.provider);
  }

  async fromEthToZkSync(receiverAddress: string, amount: string): Promise<TransactionResponse> {
    // TODO:: Improve it @shamil8
    const { gasPrice, } = await this.provider.getFeeData();
    console.log('gasPriceeee', gasPrice);

    if (!gasPrice) {
      throw Error('Can not find gasPrice');
    }

    const expectedCost = await this.ethContract.l2TransactionBaseCost(
      gasPrice,
      RECOMMENDED_DEPOSIT_L2_GAS_LIMIT,
      REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT
    );

    return this.ethContract.requestL2Transaction(
      this.signer,
      receiverAddress,
      amount,
      Buffer.from(''),
      RECOMMENDED_DEPOSIT_L2_GAS_LIMIT, // TODO:: IMPROVE IT! @shamil8
      REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
      [],
      receiverAddress,
      parseEther(amount) + expectedCost
    );
  }

  async estimateGas(receiverAddress: string, amount: string, l2GasLimit: bigint): Promise<ContractTransaction> {
    return this.ethContract.populateTrx(
      this.signer,
      receiverAddress,
      amount,
      Buffer.from(''),
      l2GasLimit, // TODO:: IMPROVE IT! @shamil8
      REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
      [],
      receiverAddress,
      amount
    );
  }
}
