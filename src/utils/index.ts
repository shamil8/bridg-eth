/** timeToMs & msToTime const and types */
const timeTypes = {
  second: 1000,
  minute: 60,
  hour: 60,
  day: 24,
  week: 7,
};

type TUnitTime = keyof typeof timeTypes;
type TAsyncFunc <A, O> = (...args: A[]) => Promise<O>;

const timeUnits = Object.keys(timeTypes) as TUnitTime[];

/** Math floor with precision */
export const mathFloor = (value: number, precision = 4): number => {
  const form = 10 ** precision;

  return Math.floor(value * form) / form || 0;
};

/** Math ceil with precision */
export const mathCeil = (value: number, precision = 2): number => {
  const form = 10 ** precision;

  return Math.ceil(value * form) / form || 0;
};

/** The sleep func returns new promise for await something. */
export const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/** Convert time with unit to milliseconds */
export const timeToMs = (time: number, unit: TUnitTime = 'second'): number => {
  if (unit === 'second') {
    return time * timeTypes[unit];
  }

  return timeToMs(time * timeTypes[unit], timeUnits[timeUnits.indexOf(unit) - 1]);
};

/** Convert milliseconds to time with unit */
export const msToTime = (time: number, unit: TUnitTime = 'second'): number => {
  if (unit === 'second') {
    return mathFloor(time / timeTypes[unit]);
  }

  return msToTime(time / timeTypes[unit], timeUnits[timeUnits.indexOf(unit) - 1]);
};

/** The parallelLoop func start with p (params) repeatEveryDays and wakeTime */
export async function parallelLoop(
  callFun: TAsyncFunc<any, void>,
  p: unknown[],
  repeatEveryDays: number,
  wakeTime?: string
): Promise<void> {
  let diff: number | null = null;

  if (wakeTime) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const runDate = new Date(`${dateStr}T${wakeTime}`);

    if (runDate.getTime() < today.getTime()) {
      runDate.setDate(runDate.getDate() + repeatEveryDays);
    }

    diff = runDate.getTime() - today.getTime();

    console.log(`parallelLoop func: '${callFun.name || 'anon'}', will run: ${runDate.toISOString()}`);
  }

  while (repeatEveryDays) {
    if (diff) {
      await sleep(diff); /** for first loop */
    }

    await callFun(...p);

    diff = null;

    await sleep(timeToMs(repeatEveryDays, 'day')); // for other loops
  }
}
