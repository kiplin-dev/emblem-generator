import Raphael from 'raphael'
import assets from './assets'
import colors from './colors'

class EmblemGenerator {
  constructor() {
    this.flags_defs = {
      "FlipBackgroundVertical": 1,
      "FlipBackgroundHorizontal": 2,
      "FlipForegroundVertical": 4,
      "FlipForegroundHorizontal": 8
    }

    this.defs = assets.defs
    this.bg_defs = assets.bg_defs

    this.color_defs = colors
  }


  init(id, size, bgColor) {
    this.paper = Raphael(id, size, size);

    // used for shadow over color
    this.pto2_color = '#000000';
    this.pto2_op = 0.3;

    // used for cross color transparency
    this.pt1_op = 0.3;

    // used for emblem background
    this.bg_op = 1;

    // paper background
    this.bg_color = bgColor || '';
    this.bg_img = 'assets/img_bg.png';

    // config required for transformation
    this.base_size = 256;
    this.flip = 0; // 1 - flipV_Bg, 2 - flipH_Bg, 4 - flipV_Fg, 8 - flipH_Fg

    return this;
  }

  drawEmblemObj (EGobj) {
    this.setFlipsEG(EGobj.flags);

    var colorBg = this.color_defs[EGobj.background_color_id] || '#000000',
      color1 = this.color_defs[EGobj.foreground_secondary_color_id] || '#FFFFFF',
      color2 = this.color_defs[EGobj.foreground_primary_color_id] || '#FF0000';

    var defFg = this.defs[EGobj.foreground_id] || '',
      defBg = this.bg_defs[EGobj.background_id] || '';

    this.drawEmblem(defFg, color1, color2, defBg, colorBg);
  }

  drawEmblem (defFg, color1, color2, defBg, colorBg) {
    var paper = this.paper;

    paper.clear();

    // set background
    if (this.bg_color !== '')
      paper.rect(0, 0, paper.width, paper.height).attr({'fill':this.bg_color, 'stroke':this.bg_color});
    else
      paper.image(this.bg_img, 0, 0, paper.width, paper.height);

    this.drawEmblemBg(defBg, colorBg);
    this.drawEmblemFg(defFg, color1, color2);
  }

  drawEmblemFg (def, color1, color2) {
    var paper = this.paper,
      i;

    var scale = paper.width / this.base_size,
      transformStr = (scale != 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';

    if (this.flip > 3)
    {
      transformStr = transformStr.concat(' s',((this.flip & 8) !== 0) ? -1 : 1,',',((this.flip & 4) !== 0) ? -1 : 1,',',this.base_size/2,',',this.base_size/2);
    }

    this.paths = [];
    var paths = this.paths;
    if (def.p1)
    {
      for(i=0;i<def.p1.length;i++)
        paths[paths.length] = paper.path(def.p1[i]).attr({'fill':color1, 'stroke':'none'}).transform(transformStr);
    }

    if (def.p2)
    {
      for(i=0;i<def.p2.length;i++)
        paths[paths.length] = paper.path(def.p2[i]).attr({'fill':color2, 'stroke':'none'}).transform(transformStr);
    }

    if (def.pto2)
    {
      for(i=0;i<def.pto2.length;i++)
        paths[paths.length] = paper.path(def.pto2[i]).attr({'fill':this.pto2_color, 'stroke':'none', 'opacity':this.pto2_op}).transform(transformStr);
    }

    if (def.pt1)
    {
      for(i=0;i<def.pt1.length;i++)
        paths[paths.length] = paper.path(def.pt1[i]).attr({'fill':color1, 'stroke':'none', 'opacity':this.pt1_op}).transform(transformStr);
    }

    return paths;
  }

  drawEmblemBg (def, color) {
    var paper = this.paper,
      i,
      opacity = def.t ? this.bg_op : 1;

    var scale = paper.width / this.base_size,
      transformStr = (scale != 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';

    if ((this.flip & 1) !== 0 || (this.flip & 2) !== 0)
    {
      transformStr = transformStr.concat(' s',((this.flip & 2) !== 0) ? -1 : 1,',',((this.flip & 1) !== 0) ? -1 : 1,',',this.base_size/2,',',this.base_size/2);
    }

    this.bg_paths = [];

    var paths = this.bg_paths;
    if (def.p)
    {
      for(i=0;i<def.p.length;i++)
        paths[paths.length] = paper.path(def.p[i]).attr({'fill':color, 'stroke':'none', 'opacity': opacity}).transform(transformStr);
    }

    return paths;
  }

  setFlipsEG (flags) {
    this.flip = 0;

    for(var i=0; i<flags.length; i++)
    {
      if (this.flags_defs[flags[i]])
      {
        this.flip += this.flags_defs[flags[i]];
      }
    }
  }
}

export default EmblemGenerator
