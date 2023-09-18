import {
  mathFloor, msToTime, parallelLoop, timeToMs,
} from './index';

test('mathFloor test with precision', () => {
  expect(mathFloor(0, 99)).toBe(0);
  expect(mathFloor(0.12345)).toBe(0.1234);
  expect(mathFloor(0.12345, 5)).toBe(0.12345);
  expect(mathFloor(0.4327998237457239)).toEqual(0.4327);
  expect(mathFloor(0.4327998237457239, 12)).toBe(0.432799823745);
});

test('timeToMs type tests', () => {
  /** Second tests */
  expect(timeToMs(0)).toBe(0);
  expect(timeToMs(1)).toEqual(1000);
  expect(timeToMs(50, 'second')).toBe(50000);

  /** Minute tests */
  expect(timeToMs(0, 'minute')).toBe(0);
  expect(timeToMs(1, 'minute')).toEqual(60000);
  expect(timeToMs(50, 'minute')).toBe(3e6);

  /** Hour tests */
  expect(timeToMs(0, 'hour')).toBe(0);
  expect(timeToMs(1, 'hour')).toEqual(3600000);
  expect(timeToMs(50, 'hour')).toBe(18e7);

  /** Day tests */
  expect(timeToMs(1, 'day')).toEqual(24 * 36e5);
  expect(timeToMs(50, 'day')).toBe(50 * 24 * 36e5);

  /** Week tests */
  expect(timeToMs(1, 'week')).toEqual(7 * 24 * 36e5);
  expect(timeToMs(50, 'week')).toBe(50 * 7 * 24 * 36e5);
});

test('msToTime type tests', () => {
  /** Second tests */
  expect(msToTime(0)).toBe(0);
  expect(msToTime(1000)).toEqual(1);
  expect(msToTime(50000, 'second')).toBe(50);
  expect(msToTime(24, 'second')).toBe(0.024);

  /** Minute tests */
  expect(msToTime(0, 'minute')).toBe(0);
  expect(msToTime(60000, 'minute')).toEqual(1);
  expect(msToTime(3e6, 'minute')).toBe(50);
  expect(msToTime(24, 'minute')).toBe(0.0004);

  /** Hour tests */
  expect(msToTime(0, 'hour')).toBe(0);
  expect(msToTime(3600000, 'hour')).toEqual(1);
  expect(msToTime(18e7, 'hour')).toBe(50);
  expect(msToTime(2400, 'hour')).toBe(0.0006);

  /** Day tests */
  expect(msToTime(86400000, 'day')).toEqual(1);
  expect(msToTime(4320000000, 'day')).toBe(50);
  expect(msToTime(24000, 'day')).toBe(0.0002);

  /** Week tests */
  expect(msToTime(604800000, 'week')).toEqual(1);
  expect(msToTime(30240000000, 'week')).toBe(50);
  expect(msToTime(35240000000, 'week')).toBe(58.2671);
  expect(msToTime(240000, 'week')).toBe(0.0003);
});

test('parallelLoop type tests', () => {
  parallelLoop(async (...args) => {
    await console.log('I am here heeee!', args);
  }, [12, 'shamil'], 4, '11:00');
});
