
export const paranums = { 'F': 2, 'M': 4, 'MX': 2, 'MY': 2, 'S': 2, 'V': 4, 'R': 2, 'C': 6, 'P': 1 };

function parse_loop(commands, relative_time, data, nline) {
  const line = data[nline];
  if (line[1] !== 'L') return [nline + 1, 0];
  let starttime = relative_time + line[2];
  let loopcount = line[3];
  const indent = data[nline][0];
  if (loopcount === 0) {
    console.warn('Loop count is 0');
    loopcount = 1; // 某些文件中有数据错误，将 0 视为 1
  }
  if (loopcount < 0) {
    console.warn('Loop count is negative');
    let i = nline + 1;
    while (i < data.length && data[i][0] > indent) i++;
    return [i, starttime];
  }
  let j = 0;
  let endtimes = [];
  for (let i = nline + 1; loopcount > 0;) {
    if (i >= data.length || data[i][0] <= indent) {
      j = i;
      i = nline + 1;
      starttime = Math.max(...endtimes);
      endtimes = [];
      loopcount--;
      continue;
    }
    const [next_i, endtime] = parse(commands, starttime, data, i);
    i = next_i;
    endtimes.push(endtime);
  }
  return [j, starttime];
};

export function parse(commands, relative_time, data, nline) {
  const line = data[nline];
  if (line[1] === 'L') return parse_loop(commands, relative_time, data, nline);
  const paranum = paranums[line[1]];
  if (paranum === undefined) {
    console.warn(`Unknown command: ${line[1]}`);
    return [nline + 1, 0];
  }
  const command = {
    type: line[1],
    easing: line[2],
    starttime: relative_time + line[3],
    endtime: relative_time + (line[4] !== '' ? line[4] : line[3]),
  };
  const paras = line.slice(5);
  if (paras.length < paranum) {
    for (let i = 0; paras.length < paranum; i++) {
      paras.push(paras[i]);
    }
    commands.push({ ...command, params: paras.slice() });
    return [nline + 1, command.endtime];
  }
  let last_endtime = 0;
  for (let i = 0; i < paras.length / paranum; i++) {
    commands.push({ ...command, params: paras.slice(i * paranum, (i + 1) * paranum) });
    last_endtime = command.endtime;
    const duration = command.endtime - command.starttime;
    command.starttime = command.endtime;
    command.endtime += duration;
  }
  return [nline + 1, last_endtime];
};

import { Timeline } from './timeline.mjs';

// 精灵图命令
class SpriteCommands {
  x = new Timeline(); // 位置 x
  y = new Timeline(); // 位置 y
  w = new Timeline(); // 宽度
  h = new Timeline(); // 高度
  r = new Timeline(); // 红色
  g = new Timeline(); // 绿色
  b = new Timeline(); // 蓝色
  a = new Timeline(); // 不透明度
  ro = new Timeline(); // 旋转弧度
  ma = new Timeline(); // 加法混合
  hr = new Timeline(); // 水平翻转
  vr = new Timeline(); // 垂直翻转

  reset() {
    this.x.reset();
    this.y.reset();
    this.w.reset();
    this.h.reset();
    this.r.reset();
    this.g.reset();
    this.b.reset();
    this.a.reset();
    this.ro.reset();
    this.ma.reset();
    this.hr.reset();
    this.vr.reset();
  }

  compile(cmds, sprite) {
    for (const cmd of cmds) switch (cmd.type) {
      case 'M': {
        const x1 = cmd.params[0];
        const y1 = cmd.params[1];
        const x2 = cmd.params[2];
        const y2 = cmd.params[3];
        if (cmd.starttime === cmd.endtime) {
          this.x.add(cmd.endtime, x2, -1);
          this.y.add(cmd.endtime, y2, -1);
          break;
        }
        this.x.add(cmd.starttime, x1, -1);
        this.y.add(cmd.starttime, y1, -1);
        this.x.add(cmd.endtime, x2, cmd.easing);
        this.y.add(cmd.endtime, y2, cmd.easing);
        break;
      }
      case 'MX': {
        const x1 = cmd.params[0];
        const x2 = cmd.params[1];
        if (cmd.starttime === cmd.endtime) {
          this.x.add(cmd.endtime, x2, -1);
          break;
        }
        this.x.add(cmd.starttime, x1, -1);
        this.x.add(cmd.endtime, x2, cmd.easing);
        break;
      }
      case 'MY': {
        const y1 = cmd.params[0];
        const y2 = cmd.params[1];
        if (cmd.starttime === cmd.endtime) {
          this.y.add(cmd.endtime, y2, -1);
          break;
        }
        this.y.add(cmd.starttime, y1, -1);
        this.y.add(cmd.endtime, y2, cmd.easing);
        break;
      }
      case 'F': {
        const a1 = cmd.params[0];
        const a2 = cmd.params[1];
        if (cmd.starttime === cmd.endtime) {
          this.a.add(cmd.endtime, a2, -1);
          break;
        }
        this.a.add(cmd.starttime, a1, -1);
        this.a.add(cmd.endtime, a2, cmd.easing);
        break;
      }
      case 'S': {
        const s1 = cmd.params[0];
        const s2 = cmd.params[1];
        if (cmd.starttime === cmd.endtime) {
          this.w.add(cmd.endtime, s2, -1);
          this.h.add(cmd.endtime, s2, -1);
          break;
        }
        this.w.add(cmd.starttime, s1, -1);
        this.h.add(cmd.starttime, s1, -1);
        this.w.add(cmd.endtime, s2, cmd.easing);
        this.h.add(cmd.endtime, s2, cmd.easing);
        break;
      }
      case 'V': {
        const w1 = cmd.params[0];
        const h1 = cmd.params[1];
        const w2 = cmd.params[2];
        const h2 = cmd.params[3];
        if (cmd.starttime === cmd.endtime) {
          this.w.add(cmd.endtime, w2, -1);
          this.h.add(cmd.endtime, h2, -1);
          break;
        }
        this.w.add(cmd.starttime, w1, -1);
        this.h.add(cmd.starttime, h1, -1);
        this.w.add(cmd.endtime, w2, cmd.easing);
        this.h.add(cmd.endtime, h2, cmd.easing);
        break;
      }
      case 'R': {
        const r1 = cmd.params[0];
        const r2 = cmd.params[1];
        if (cmd.starttime === cmd.endtime) {
          this.ro.add(cmd.endtime, r2, -1);
          break;
        }
        this.ro.add(cmd.starttime, r1, -1);
        this.ro.add(cmd.endtime, r2, cmd.easing);
        break;
      }
      case 'C': {
        const r1 = cmd.params[0] / 255;
        const g1 = cmd.params[1] / 255;
        const b1 = cmd.params[2] / 255;
        const r2 = cmd.params[3] / 255;
        const g2 = cmd.params[4] / 255;
        const b2 = cmd.params[5] / 255;
        if (cmd.starttime === cmd.endtime) {
          this.r.add(cmd.endtime, r2, -1);
          this.g.add(cmd.endtime, g2, -1);
          this.b.add(cmd.endtime, b2, -1);
          break;
        }
        this.r.add(cmd.starttime, r1, -1);
        this.g.add(cmd.starttime, g1, -1);
        this.b.add(cmd.starttime, b1, -1);
        this.r.add(cmd.endtime, r2, cmd.easing);
        this.g.add(cmd.endtime, g2, cmd.easing);
        this.b.add(cmd.endtime, b2, cmd.easing);
        break;
      }
      case 'P': {
        switch (cmd.params[0]) {
          case 'H':
            this.hr.add(cmd.starttime, 1, -1);
            if (cmd.endtime !== cmd.starttime) this.hr.add(cmd.endtime, 0, -1);
            break;
          case 'V':
            this.vr.add(cmd.starttime, 1, -1);
            if (cmd.endtime !== cmd.starttime) this.vr.add(cmd.endtime, 0, -1);
            break;
          case 'A':
            this.ma.add(cmd.starttime, 1, -1);
            if (cmd.endtime !== cmd.starttime) this.ma.add(cmd.endtime, 0, -1);
            break;
          default:
            console.warn(`Unknown parameter for P command: ${cmd.params[0]}`);
            break;
        }
        break;
      }
      default:
        console.warn(`Unknown command: ${cmd.type}`);
        break;
    }
    if (this.x.isempty()) this.x.add(sprite.starttime, sprite.x, -1);
    if (this.y.isempty()) this.y.add(sprite.starttime, sprite.y, -1);
    if (this.w.isempty()) this.w.add(sprite.starttime, 1, -1);
    if (this.h.isempty()) this.h.add(sprite.starttime, 1, -1);
    if (this.r.isempty()) this.r.add(sprite.starttime, 1, -1);
    if (this.g.isempty()) this.g.add(sprite.starttime, 1, -1);
    if (this.b.isempty()) this.b.add(sprite.starttime, 1, -1);
    if (this.a.isempty()) this.a.add(sprite.starttime, 1, -1);
    if (this.ro.isempty()) this.ro.add(sprite.starttime, 0, -1);
    if (this.ma.isempty()) this.ma.add(sprite.starttime, 0, -1);
    if (this.hr.isempty()) this.hr.add(sprite.starttime, 0, -1);
    if (this.vr.isempty()) this.vr.add(sprite.starttime, 0, -1);
    return this;
  }
}

export function compile(cmds, sprite) {
  cmds.sort((a, b) => a.endtime - b.endtime);
  return new SpriteCommands().compile(cmds, sprite);
}
