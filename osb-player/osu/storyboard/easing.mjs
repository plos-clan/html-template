
export const functions = [
  x => x, // Linear
  x => Math.sin((x * Math.PI) / 2), // Easing Out
  x => 1 - Math.cos((x * Math.PI) / 2), // Easing In

  x => x * x, //
  x => 1 - (1 - x) * (1 - x), //
  x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, //

  x => x * x * x, //
  x => 1 - Math.pow(1 - x, 3), //
  x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, //

  x => x * x * x * x, //
  x => 1 - Math.pow(1 - x, 4), //
  x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2, //

  x => x * x * x * x * x, //
  x => 1 - Math.pow(1 - x, 5), //
  x => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5), //

  x => 1 - Math.cos((x * Math.PI) / 2), //
  x => Math.sin((x * Math.PI) / 2), //
  x => -(Math.cos(Math.PI * x) - 1) / 2, //

  x => Math.pow(2, 10 * x - 10), //
  x => 1 - Math.pow(2, -10 * x), //
  x => x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2, //

  x => 1 - Math.sqrt(1 - Math.pow(x, 2)), //
  x => Math.sqrt(1 - Math.pow(x - 1, 2)), //
  x => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2, //

  x => -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * (2 * Math.PI / 3)), //
  x => Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI / 3)) + 1, //
  x => x, //
  x => x, //
  x => x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * (2 * Math.PI / 4.5))) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * (2 * Math.PI / 4.5))) / 2 + 1, //

  x => 2.70158 * x * x * x - 1.70158 * x * x, //
  x => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2), //
  x => x < 0.5 ? (Math.pow(2 * x, 2) * ((2.5949095 + 1) * 2 * x - 2.5949095)) / 2 : (Math.pow(2 * x - 2, 2) * ((2.5949095 + 1) * (x * 2 - 2) + 2.5949095) + 2) / 2, //

  x => 1 - (x => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  })(1 - x), //
  x => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }, //
  x => {
    const f = x => {
      const n1 = 7.5625;
      const d1 = 2.75;

      if (x < 1 / d1) {
        return n1 * x * x;
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    };
    return x < 0.5 ? (1 - f(1 - 2 * x)) / 2 : (1 + f(2 * x - 1)) / 2;
  }, //
];

// Interpolation
export function ip(v, starttime, endtime, time, easing) {
  if (time >= endtime || endtime === starttime) return v.map(([v1, v2]) => v2);
  if (time <= starttime) return v.map(([v1, v2]) => v1);
  const t = (time - starttime) / (endtime - starttime);
  const k = easing_functions[easing](t);
  return v.map(([v1, v2]) => v1 + (v2 - v1) * k);
}

export function ip1(x1, x2, starttime, endtime, time, easing) {
  if (time >= endtime || endtime === starttime) return x2;
  if (time <= starttime) return x1;
  const t = (time - starttime) / (endtime - starttime);
  const k = easing_functions[easing](t);
  return x1 + (x2 - x1) * k;
}

export function ip2(x1, y1, x2, y2, starttime, endtime, time, easing) {
  if (time >= endtime || endtime === starttime) return { x: x2, y: y2 };
  if (time <= starttime) return { x: x1, y: y1 };
  const t = (time - starttime) / (endtime - starttime);
  const k = easing_functions[easing](t);
  return {
    x: x1 + (x2 - x1) * k,
    y: y1 + (y2 - y1) * k,
  };
}

export function ip3(x1, y1, z1, x2, y2, z2, starttime, endtime, time, easing) {
  if (time >= endtime || endtime === starttime) return { x: x2, y: y2, z: z2 };
  if (time <= starttime) return { x: x1, y: y1, z: z1 };
  const t = (time - starttime) / (endtime - starttime);
  const k = easing_functions[easing](t);
  return {
    x: x1 + (x2 - x1) * k,
    y: y1 + (y2 - y1) * k,
    z: z1 + (z2 - z1) * k,
  };
}
