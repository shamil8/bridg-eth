import { JsonRpcProvider, Wallet, } from 'ethers';

import config from '../config';

export class NetworkProvider {
  public readonly provider!: JsonRpcProvider;

  protected readonly signer: Wallet;

  constructor(private readonly rpcProvider: string) {
    this.provider = new JsonRpcProvider(this.rpcProvider);

    if (!config.walletPrivateKey) {
      throw new Error('Can not find WALLET_PRIVATE_KEY');
    }

    this.signer = new Wallet(config.walletPrivateKey, this.provider);
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async getSignerBalance(): Promise<bigint> {
    return this.provider.getBalance(this.signer.address);
  }
}
