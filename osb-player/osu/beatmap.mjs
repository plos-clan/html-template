
export class PlayfieldPos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toStoryboardPos() {
    return new StoryboardPos(this.x + 64, this.y + 56);
  }
}

export class StoryboardPos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toPlayfieldPos() {
    return new PlayfieldPos(this.x - 64, this.y - 56);
  }
}

const osu_sections = ['General', 'Editor', 'Metadata', 'Difficulty', 'Events', 'TimingPoints', 'Colours', 'HitObjects'];

class General {
  AudioFilename = null;  // Location of the audio file relative to the current folder
  //                     // 音频文件相对于当前文件夹的位置
  AudioLeadIn = 0;       // Milliseconds of silence before the audio starts playing
  //                     // 音频开始播放前的静音毫秒数
  PreviewTime = -1;      // Time in milliseconds when the audio preview should start
  //                     // 音频预览应开始的时间（毫秒）
  Countdown = 1;         // Speed of the countdown before the first hit object (0 = no countdown, 1 = normal, 2 = half, 3 = double)
  //                     // 第一个击打物件前的倒计时速度（0 = 无倒计时，1 = 正常，2 = 半速，3 = 双倍）
  SampleSet = 'Normal';  // Default sample set
  //                     // 默认采样集
  StackLeniency = 0.7;   // Multiplier for the threshold in time where hit objects placed close together stack (0–1)
  //                     // 击打物件放置在一起堆叠的时间阈值的倍数（0–1）
  Mode = 0;              // Game mode (0 = osu!, 1 = osu!taiko, 2 = osu!catch, 3 = osu!mania)
  //                     // 游戏模式（0 = osu!，1 = osu!taiko，2 = osu!catch，3 = osu!mania）
  LetterboxInBreaks = 0; // Whether or not breaks have a letterboxing effect
  //                     // 休息时间是否有信箱效果
  UseSkinSprites = 0;    // Whether or not the storyboard can use the user's skin images
  //                     // 剧情板是否可以使用用户的皮肤图像
  OverlayPosition = 'NoChange'; // Draw order of hit circle overlays compared to hit numbers (NoChange = use skin setting, Below = draw overlays under numbers, Above = draw overlays on top of numbers)
  //                            // 击打圆圈覆盖层相对于击打数字的绘制顺序（NoChange = 使用皮肤设置，Below = 在数字下绘制覆盖层，Above = 在数字上绘制覆盖层）
  SkinPreference = null; // Preferred skin to use during gameplay
  //                     // 游戏过程中使用的首选皮肤
  EpilepsyWarning = 0;   // Whether or not a warning about flashing colours should be shown at the beginning of the map
  //                     // 地图开始时是否显示关于闪烁颜色的警告
  CountdownOffset = 0;   // Time in beats that the countdown starts before the first hit object
  //                     // 倒计时在第一个击打物件前开始的节拍时间
  SpecialStyle = 0;      // Whether or not the "N+1" style key layout is used for osu!mania
  //                     // osu!mania 是否使用“N+1”样式的键布局
  WidescreenStoryboard = 0; // Whether or not the storyboard allows widescreen viewing
  //                        // 剧情板是否允许宽屏查看
  SamplesMatchPlaybackRate = 0; // Whether or not sound samples will change rate when playing with speed-changing mods
  //                            // 使用变速模组时，声音样本是否会改变速率

  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this[key] === undefined) {
        console.warn(`beatmap.General: Unknown property ${key}`);
        return;
      }
      if (typeof this[key] === 'number') {
        this[key] = parseFloat(value);
      } else if (Array.isArray(this[key])) {
        this[key] = value.split(this[`${key}_split`]);
      } else {
        this[key] = value;
      }
    });
    if (this.AudioFilename === null) {
      console.warn('beatmap.General: Missing AudioFilename');
    } else {
      this.AudioFilename = this.AudioFilename.replace(/\\/g, '/').toLowerCase();
    }
  }
}

class Editor {
  Bookmarks = [];      // List of times in milliseconds where bookmarks are placed
  //                   // 放置书签的毫秒时间列表
  DistanceSpacing = 1; // Circle size relative to the normal spacing
  //                   // 相对于正常间距的圆大小
  BeatDivisor = 1;     // Beat snap divisor
  //                   // 节拍分割器
  GridSize = 4;        // Grid size for the distance snap
  //                   // 距离分割的网格大小
  TimelineZoom = 1;    // Scale of the timeline
  //                   // 时间轴的缩放

  Bookmarks_split = ',';

  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this[key] === undefined) {
        console.warn(`beatmap.Editor: Unknown property ${key}`);
        return;
      }
      if (typeof this[key] === 'number') {
        this[key] = parseFloat(value);
      } else if (Array.isArray(this[key])) {
        this[key] = value.split(this[`${key}_split`]);
      } else {
        this[key] = value;
      }
    });
  }
}

class Metadata {
  Title = null;         // Song title
  //                    // 歌曲标题
  TitleUnicode = null;  // Unicode song title
  //                    // Unicode 歌曲标题
  Artist = null;        // Song artist
  //                    // 歌曲艺术家
  ArtistUnicode = null; // Unicode song artist
  //                    // Unicode 歌曲艺术家
  Creator = null;       // Beatmap creator
  //                    // 谱面创作者
  Version = null;       // Difficulty name
  //                    // 难度名称
  Source = null;        // Original media the song was produced for
  //                    // 歌曲原始媒体
  Tags = [];            // Space-separated list of tags
  //                    // 以空格分隔的标签列表
  BeatmapID = null;     // Beatmap ID
  //                    // 谱面 ID
  BeatmapSetID = null;  // Beatmap set ID
  //                    // 谱面集 ID

  Tags_split = ' ';

  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this[key] === undefined) {
        console.warn(`beatmap.Metadata: Unknown property ${key}`);
        return;
      }
      if (typeof this[key] === 'number') {
        this[key] = parseFloat(value);
      } else if (Array.isArray(this[key])) {
        this[key] = value.split(this[`${key}_split`]);
      } else {
        this[key] = value;
      }
    });
  }
}

class Difficulty {
  HPDrainRate = 5;       // Health drain rate
  //                     // 生命值减少速率
  CircleSize = 5;        // Circle size
  //                     // 圆大小
  OverallDifficulty = 5; // Overall difficulty
  //                     // 总体难度
  ApproachRate = 5;      // Approach rate
  //                     // 接近速度
  SliderMultiplier = 1;  // Base slider velocity in hundreds of osu! pixels per beat
  //                     // 每节拍的 osu! 像素数的基本滑条速度
  SliderTickRate = 1;    // Amount of slider ticks per beat
  //                     // 每节拍的滑条刻度数

  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this[key] === undefined) {
        console.warn(`beatmap.Difficulty: Unknown property ${key}`);
        return;
      }
      if (typeof this[key] === 'number') {
        this[key] = parseFloat(value);
      } else if (Array.isArray(this[key])) {
        this[key] = value.split(this[`${key}_split`]);
      } else {
        this[key] = value;
      }
    });
  }
}

import { Events } from './storyboard.mjs';

class Color {
  r = 0;
  g = 0;
  b = 0;
  v = 0;

  constructor(data) {
    if (!data) {
      if (data !== null) console.warn('beatmap.Color: Empty data');
      return;
    }
    data.split(',').forEach((value, index) => {
      switch (index) {
        case 0: this.r = parseInt(value); break;
        case 1: this.g = parseInt(value); break;
        case 2: this.b = parseInt(value); break;
      }
    });
    this.v = (this.r << 16) + (this.g << 8) + this.b;
  }
}

class TimingPoint {
  time = 0;
  beat_length = 0;
  meter = 4;
  sample_set = 0;
  sample_index = 0;
  volume = 100;
  uninherited = true;
  kiai = false;

  constructor(data) {
    data = data.split(',');
    this.time = parseInt(data[0]);
    this.beat_length = parseFloat(data[1]);
    this.meter = parseInt(data[2]);
    this.sample_set = parseInt(data[3]);
    this.sample_index = parseInt(data[4]);
    this.volume = parseInt(data[5]);
    this.uninherited = parseInt(data[6]) === 1;
    this.kiai = parseInt(data[7]) === 1;
  }
}

class Colours {
  Combo = {};
  SliderTrackOverride = null;
  SliderBorder = null;

  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('Combo')) {
        const index = parseInt(key.slice(5));
        if (isNaN(index)) {
          console.warn(`beatmap.Colours: Invalid combo index ${index}`);
          return;
        }
        this.Combo[index] = new Color(value);
        return;
      }
      if (this[key] === undefined) {
        console.warn(`beatmap.Colours: Unknown property ${key}`);
        return;
      }
      this[key] = new Color(value);
    });
  }
}

import { HitObject } from './hitobject.mjs';

function parse_file(text) {
  let lines = text.split('\n').filter(line => line && !line.startsWith('//')).map(line => line.trimEnd());

  const data = Object.fromEntries(osu_sections.map(section => [section, []]));

  let section = null;
  for (const line of lines) {
    if (line.length === 0) continue;
    if (line.startsWith('[') && line.endsWith(']')) {
      section = data[line.slice(1, -1)];
      continue;
    }
    section?.push(line);
  }

  for (const section of ['General', 'Editor', 'Metadata', 'Difficulty', 'Colours']) {
    data[section] = Object.fromEntries(data[section].map(line => line.split(':', 2).map(part => part.trim())));
  }

  return data;
}

class Beatmap {
  timing_points = [];
  colours = {};
  hit_objects = [];

  constructor(data, next_storyboard_event_id) {
    data = parse_file(data);
    this.general = new General(data.General);
    this.editor = new Editor(data.Editor);
    this.metadata = new Metadata(data.Metadata);
    this.difficulty = new Difficulty(data.Difficulty);
    this.events = new Events(data.Events, next_storyboard_event_id);
    this.timing_points = data.TimingPoints.map(point => new TimingPoint(point));
    this.colours = new Colours(data.Colours);
    this.hit_objects = data.HitObjects.map(object => new HitObject(object));
  }
}

class BeatmapSet {
  files = {};
  beatmaps = [];
  storyboard = null;
  next_storyboard_event_id = 0;

  constructor(files) {
    this.files = files;
  }

  load_osu_file() {
    for (let name in this.files) if (name.endsWith('.osu')) {
      const beatmap = new Beatmap(new TextDecoder().decode(this.files[name]), this.next_storyboard_event_id);
      this.beatmaps.push(beatmap);
      this.next_storyboard_event_id = beatmap.events.next_event_id;
    }
    // 目前无法计算难度，使用 OD 代替
    this.beatmaps.sort((a, b) => a.difficulty.OverallDifficulty - b.difficulty.OverallDifficulty);
  }

  load_osb_file() {
    for (let name in this.files) if (name.endsWith('.osb')) {
      if (this.storyboard !== null) {
        console.warn('Multiple storyboards found in beatmap set, ignoring additional');
        continue;
      }
      const data = parse_file(new TextDecoder().decode(this.files[name]));
      if (Object.keys(data.General).length !== 0
        || Object.keys(data.Editor).length !== 0
        || Object.keys(data.Metadata).length !== 0
        || Object.keys(data.Difficulty).length !== 0
        || data.TimingPoints.length !== 0
        || Object.keys(data.Colours).length !== 0
        || data.HitObjects.length !== 0) {
        console.warn('Storyboard data should not contain any section other than Events');
      }
      this.storyboard = new Events(data.Events, this.next_storyboard_event_id);
      this.next_storyboard_event_id = this.storyboard.next_event_id;
    }
  }
}

async function load_zip_file(file, show_tips = null) {
  if (show_tips) show_tips('Receiving file...');
  const arrayBuffer = await file.arrayBuffer();
  if (show_tips) show_tips('Unziping file...');
  const zip = await new JSZip().loadAsync(arrayBuffer);
  const files = {};
  await Promise.all(Object.keys(zip.files).map(async relativePath => {
    const content = await zip.files[relativePath].async('arraybuffer');
    files[relativePath.toLowerCase()] = content;
  }));
  return files;
}

export async function load(file, show_tips = null) {
  const files = await load_zip_file(file);
  if (show_tips) show_tips('Parsing files...');
  const set = new BeatmapSet(files);
  set.load_osu_file();
  set.load_osb_file();
  if (show_tips) show_tips('Finished.');
  return set;
}
