import { TransactionResponse, } from 'ethers/src.ts/providers/provider';

import config from '../config';
import { NetworkProvider, } from './network-provider';
import { EthContract, } from '../contracts/eth-contract';
import { REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT, } from '../config/zk-sync';

export class EthProvider extends NetworkProvider {
  private readonly ethContract: EthContract;

  constructor() {
    super(config.ethProvider);

    this.ethContract = new EthContract(this.provider);
  }

  async fromEthToZkSync(receiverAddress: string, l2Value: bigint, _l2GasLimit: bigint)
    : Promise<TransactionResponse> {
    const expectedCost = await this.expectedCost(_l2GasLimit);

    return this.ethContract.requestL2Transaction(
      this.signer,
      receiverAddress,
      l2Value,
      Buffer.from(''),
      _l2GasLimit,
      REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
      [],
      receiverAddress,
      l2Value + expectedCost
    );
  }

  async expectedCost(_l2GasLimit: bigint): Promise<bigint> {
    const { gasPrice, } = await this.provider.getFeeData();

    if (!gasPrice) {
      throw Error('Can not find gasPrice');
    }

    return this.ethContract.l2TransactionBaseCost(
      gasPrice,
      _l2GasLimit,
      REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT
    );
  }
}
