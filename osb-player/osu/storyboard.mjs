
import * as commands from './storyboard/commands.mjs';

class SpriteStatus {
  constructor(sprite, time) {
    const { x, y, w, h, r, g, b, a, ro, ma, hr, vr } = sprite.commands;
    this.x = x.get(time);
    this.y = y.get(time);
    this.w = w.get(time);
    this.h = h.get(time);
    this.r = r.get(time);
    this.g = g.get(time);
    this.b = b.get(time);
    this.a = a.get(time);
    this.ro = ro.get(time);
    this.ma = ma.get(time);
    this.hr = hr.get(time);
    this.vr = vr.get(time);
  }
}

class Sprite {
  constructor(head, id, cmds) {
    this.id = id;
    this.type = head[0];
    this.layer = head[1];
    this.origin = head[2];
    this.path = head[3].replace(/\\/g, '/').toLowerCase();
    this.x = head[4];
    this.y = head[5];
    this.frameCount = head[0] === 'Animation' ? head[6] : null;
    this.frameDelay = head[0] === 'Animation' ? head[7] : null;
    this.looptype = head[0] === 'Animation' ? head[8] : null;
    this.starttime = Math.min(...cmds.map(cmd => cmd.starttime));
    this.endtime = Math.max(...cmds.map(cmd => cmd.endtime));
    this.commands = commands.compile(cmds, this);
  }

  reset() {
    this.commands.reset();
  }

  tick(time) {
    return new SpriteStatus(this, time);
  }
}

function parse_sprite_object(object, id) {
  const head = object[0];
  const data = object.slice(1);
  if (['Background', 'Fail', 'Pass', 'Foreground', 'Overlay'].indexOf(head[1]) === -1) {
    console.warn(`Invalid layer: ${head[1]}, set to Background`);
    head[1] = 'Background';
  }
  const cmds = [];
  for (let nline = 0; nline < data.length;) {
    const [_nline, endtime] = commands.parse(cmds, 0, data, nline);
    nline = _nline;
  }
  return new Sprite(head, id, cmds);
}

export const sprite_types = {
  0: 'Background',
  1: 'Video',
  2: 'Break',
};

// -> 分割行 -> 解析参数
// 将 a,b,c,d 解析为 [前缀空格数, a, b, c, d]
// 数字按照浮点数解析
function line_to_parts(line) {
  return `${line.match(/^(\s*)/)[0].length},${line}`.split(',').map(part => {
    part = part.trim();
    if (part.startsWith('"') && part.endsWith('"')) {
      return part.slice(1, -1);
    } else if (!isNaN(parseFloat(part))) {
      return parseFloat(part);
    } else {
      return part;
    }
  });
}

// 将按行分割的列表解析为对象列表
// 每个对象是一个列表，第一个元素是对象的类型，后续元素是参数
// 参数行的第一个元素为开头的空格数
function lines_to_objects(lines) {
  const objects = [];
  let current = null;
  for (const line of lines) {
    const parts = line_to_parts(line);
    if (parts[0] === 0) { // 文本前没有空格，是新对象的开始
      if (current) objects.push(current);
      if (Number.isInteger(parts[1])) {
        parts[1] = sprite_types[parseInt(parts[1])];
        if (parts[1] === undefined) {
          console.warn(`Unknown object type: ${parts[1]}`);
          current = null;
          continue;
        }
      }
      if (['Background', 'Video', 'Break', 'Sprite', 'Animation'].indexOf(parts[1]) === -1) {
        console.warn(`Unknown object type: ${parts[1]}`);
        current = null;
        continue;
      }
      current = [parts.slice(1)];
    } else if (current) { // 文本前有空格，是当前对象的一部分
      current.push(parts);
    } else {
      console.warn('Unexpected line:', line);
    }
  }
  if (current) objects.push(current);
  return objects;
}

export class Events {
  backgrounds = [];
  videos = [];
  breaks = [];
  sprites = [];
  animations = [];
  all = [];

  constructor(lines) {
    const objects = lines_to_objects(lines);
    objects.forEach((object, id) => {
      switch (object[0][0]) {
        case 'Background':
          this.backgrounds.push(object);
          break;
        case 'Video':
          this.videos.push(object);
          break;
        case 'Break':
          this.breaks.push(object);
          break;
        case 'Sprite':
          this.sprites.push(parse_sprite_object(object, id));
          this.all.push(this.sprites[this.sprites.length - 1]);
          break;
        case 'Animation':
          this.animations.push(parse_sprite_object(object, id));
          this.all.push(this.animations[this.animations.length - 1]);
          break;
      }
    });
  }
}
