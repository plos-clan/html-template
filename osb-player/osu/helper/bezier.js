
function bezier_length(p0, p1, p2, p3, num = 1000) {
  let length = 0;
  let lastx = p0.x, lasty = p1.x;
  for (let i = 1; i <= num; i++) {
    const t = i / num;
    const curx = (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * p1.x + 3 * (1 - t) * t ** 2 * p2.x + t ** 3 * p3.x;
    const cury = (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * p1.y + 3 * (1 - t) * t ** 2 * p2.y + t ** 3 * p3.y;
    length += Math.sqrt((curx - lastx) ** 2 + (cury - lasty) ** 2);
    lastx = curx;
    lasty = cury;
  }
  return length;
}
