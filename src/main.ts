import { ZkSyncBridge, } from './service/zk-sync-bridge';

async function main() {
  const bridge = new ZkSyncBridge();
  const blockNumbers = await bridge.checkProvidersConnection();

  console.log('blockNumbers', blockNumbers);
}

main()
  .then(() => console.log('bridge-eth started!'))
  .catch((e) => console.error('Error bridge-eth,', e));
