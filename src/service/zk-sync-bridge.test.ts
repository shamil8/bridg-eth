import { ZkSyncBridge, } from './zk-sync-bridge';
import { timeToMs, } from '../utils';

test('Check providers connection', async () => {
  const bridge = new ZkSyncBridge();

  /** Check providers connection */
  await expect(bridge.checkProvidersConnection()).resolves.toHaveProperty('zkSync');
  await expect(bridge.checkProvidersConnection()).resolves.toHaveProperty('eth');
});

// increased Timeout for Bridge transactions
jest.setTimeout(timeToMs(10, 'second'));

test('Sending transaction from ZkSync to ETH', async () => {
  const bridge = new ZkSyncBridge();
  const receiverAddress = '0x7ea3a32a418c9ddd29eba341545b67ac8d373072';
  const amount = '0.00008';

  /** Send from ZkSync to ETH */
  await expect(bridge.zkSyncToEth(receiverAddress, amount)).resolves.toEqual(expect.any(String));
});

test('Sending transaction from ETH to ZkSync', async () => {
  const bridge = new ZkSyncBridge();
  const receiverAddress = '0x7ea3a32a418c9ddd29eba341545b67ac8d373072';
  const amount = '0.000087';

  /** Send from ETH to ZkSync */
  await expect(bridge.ethToZkSync(receiverAddress, amount)).resolves.toEqual(expect.any(String));
});
