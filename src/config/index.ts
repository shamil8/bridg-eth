import { config, } from 'dotenv';

config();

export default {
  isLocal: process.env.LOCAL === 'true',

  // zkSync envs
  zkSyncProvider: process.env.ZK_SYNC_PROVIDER || 'https://testnet.era.zksync.dev',
  zkSyncContractAddress: process.env.ZK_SYNC_CONTRACT_ADDRESS,

  // ETH envs
  ethProvider: process.env.ETH_PROVIDER || 'https://rpc.goerli.eth.gateway.fm',
  ethContractAddress: process.env.ETH_CONTRACT_ADDRESS,

  walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
};
