
class Type {
  static CIRCLE = 1;
  static SLIDER = 2;
  static SPINNER = 3;
  static HOLD = 4;
}

class HitSample {
  normal = 0;
  addition = 0;
  index = 0;
  volume = 0;
  filename = '';

  constructor(data) {
    if (data.length === 0) return;
    data = data.split(':');
    this.normal = parseInt(data[0]);
    this.addition = parseInt(data[1]);
    this.index = parseInt(data[2]);
    this.volume = parseInt(data[3]);
    this.filename = data[4];
  }
}

export class HitObject {
  x = 0;
  y = 0;
  time = 0;
  type = 0;
  hit_sound = 0;
  params = [];
  hit_sample = null;

  constructor(data) {
    data = data.split(',');
    this.x = parseInt(data[0]);
    this.y = parseInt(data[1]);
    this.time = parseInt(data[2]);
    this.type = parseInt(data[3]);
    this.hit_sound = parseInt(data[4]);
    this.params = data.slice(5, -1)
    if (data[data.length - 1] !== '' && data[data.length - 1] !== '0:0:0:0:') {
      this.hit_sample = new HitSample(data[data.length - 1]);
    }
  }
}
