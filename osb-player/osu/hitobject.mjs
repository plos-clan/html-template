
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

class Type {
  circle = false; // bit 0: 圈
  slider = false; // bit 1: 滑条
  new_combo = false; // bit 2: 新组合
  spinner = false; // bit 3: 转盘
  colour_hax = 0; // bit 4-6: 跳过的颜色组合
  hold = false; // bit 7: osu!mania 按住音符

  constructor(data) {
    this.circle = (data & 1) !== 0;
    this.slider = (data & 2) !== 0;
    this.new_combo = (data & 4) !== 0;
    this.spinner = (data & 8) !== 0;
    this.colour_hax = (data & 112) >> 4;
    this.hold = (data & 128) !== 0;
    if (this.circle && this.slider) {
      console.warn('Circle and slider at the same time');
    }
  }
}

class CircleParams {
  constructor(data, object) {
    if (data.length > 0) {
      console.warn('CircleParams should be empty');
    }
  }
}

class SliderParams {
  type = ''; // The type of the slider. B: Bézier curve, C: Catmull curve, L: Linear curve, P: Perfect curve
  x = []; // x coordinates of the curve points (includes the first point)
  y = []; // y coordinates of the curve points (includes the first point)
  slides = 1; // The number of slides in the slider.
  length = 0; // The length of the slider in osu!pixels.
  edge_sounds = [];
  edge_sets = [];

  constructor(data, object) {
    const curve = data[0].split('|');
    this.type = curve[0];
    curve[0] = `${object.x}:${object.y}`;
    this.x = curve.map(p => parseInt(p.split(':')[0]));
    this.y = curve.map(p => parseInt(p.split(':')[1]));
    this.slides = parseInt(data[1]);
    this.length = parseFloat(data[2]) || 0;
    this.edge_sounds = data[3]?.split(':').map(s => parseInt(s)) || [];
    this.edge_sets = data[4]?.split(':').map(s => parseInt(s)) || [];
  }
}

class SpinnerParams {
  endtime = 0;

  constructor(data, object) {
    this.endtime = parseInt(data[0]);
  }
}

export class HitObject {
  x = 0;
  y = 0;
  time = 0;      // Time when the object is to be hit, in milliseconds from the beginning of the beatmap's audio.
  type = null;   // Bit flags indicating the type of the object.
  //             // But here we use a class to store the data.
  hit_sound = 0; // Bit flags indicating the sound the object makes when hit.
  params = null; // Extra parameters specific to the object's type.
  hit_sample = null;

  constructor(data) {
    data = data.split(',');
    this.x = parseInt(data[0]);
    this.y = parseInt(data[1]);
    this.time = parseInt(data[2]);
    this.type = new Type(parseInt(data[3]));
    this.hit_sound = parseInt(data[4]);
    if (this.type.circle) {
      this.params = new CircleParams(data.slice(5, -1), this);
    } else if (this.type.slider) {
      this.params = new SliderParams(data.slice(5, -1), this);
    } else if (this.type.spinner) {
      this.params = new SpinnerParams(data.slice(5, -1), this);
    } else {
      console.warn('Unknown hit object type');
      this.params = data.slice(5, -1);
    }
    if (data[data.length - 1] !== '' && data[data.length - 1] !== '0:0:0:0:') {
      this.hit_sample = new HitSample(data[data.length - 1]);
    }
  }
}
