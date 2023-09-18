import { ZkSyncBridge, } from './service/zk-sync-bridge';

async function main() {
  const bridge = new ZkSyncBridge();

  try {
    await bridge.run();
  }
  catch (e) {
    console.log('Error from ZkSyncBridge', e);
  }
}

main()
  .then(() => console.log('bridge-eth started!'))
  .catch((e) => console.error('Error bridge-eth,', e));
