
import { functions as easing_functions } from './easing.mjs';

class KeyFrame {
  constructor(time, value, easing) {
    this.time = time; // 时间
    this.value = value; // 值
    this.easing = easing < 0 ? undefined : easing_functions[easing]; // 缓动函数
    if (!(easing < 0) && this.easing === undefined) {
      console.warn(`Unknown easing function: ${easing}`);
      this.easing = x => x;
    }
  }
}

export class Timeline {
  keyframes = []; // 关键帧列表
  index = 0; // 当前关键帧索引
  prevframe = null; // 上一帧
  starttime = -1;
  endtime = -1;

  // 重置时间
  reset() {
    if (this.keyframes.length === 0) {
      console.warn('Timeline is empty');
      this.prevframe = null;
      return;
    }
    this.index = 1;
    this.prevframe = this.keyframes[0];
  }

  isempty() {
    return this.keyframes.length === 0;
  }

  get(time) {
    if (time < this.prevframe.time) return this.prevframe.value;
    if (this.index >= this.keyframes.length) return this.prevframe.value;
    while (time >= this.keyframes[this.index].time) {
      this.prevframe = this.keyframes[this.index];
      this.index++;
      if (this.index >= this.keyframes.length) return this.prevframe.value;
    }
    if (time === this.prevframe.time) return this.prevframe.value;
    const frame = this.keyframes[this.index];
    if (!frame.easing) return this.prevframe.value;
    const t = (time - this.prevframe.time) / (frame.time - this.prevframe.time);
    const k = frame.easing(t);
    return this.prevframe.value + (frame.value - this.prevframe.value) * k;
  }

  add(time, value, easing) {
    let resort_needed = false;
    if (this.prevframe && this.prevframe.time > time) {
      console.warn('Keyframe added out of order');
      console.log(this.prevframe.time, time);
      resort_needed = true;
    }
    this.prevframe = new KeyFrame(time, value, easing);
    this.keyframes.push(this.prevframe);
    if (resort_needed) {
      this.keyframes.sort((a, b) => a.time - b.time);
    }
    this.starttime = this.keyframes[0].time;
    this.endtime = this.keyframes[this.keyframes.length - 1].time;
  }
}
