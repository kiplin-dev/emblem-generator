import Raphael from 'raphael'
import defaultAssets from './defaultAssets'
import * as defaultBgImg from '../../assets/img_bg.png'

class EmblemGenerator {
  constructor() {
    this.flags_defs = {
      "FlipBackgroundVertical": 1,
      "FlipBackgroundHorizontal": 2,
      "FlipForegroundVertical": 4,
      "FlipForegroundHorizontal": 8
    }

    this.defaultAssets = {
      defs: defaultAssets.defs,
      bg_defs: defaultAssets.bg_defs
    }
  }


  init(id, size, assets, bgColor) {
    this.paper = Raphael(id, size, size);

    // used for shadow over color
    this.pto2_color = '#000000';
    this.pto2_op = 0.3;

    // used for cross color transparency
    this.pt1_op = 0.3;

    // used for emblem background
    this.bg_op = 1;

    // assets
    this.defs = (assets && assets.defs) ? assets.defs : this.defaultAssets.defs
    this.bg_defs = (assets && assets.bg_defs) ? assets.bg_defs : this.defaultAssets.bg_defs

    // paper background
    this.bg_color = bgColor || '';
    this.bg_img = defaultBgImg.default;

    // config required for transformation
    this.base_size = 256;
    this.flip = 0; // 1 - flipV_Bg, 2 - flipH_Bg, 4 - flipV_Fg, 8 - flipH_Fg

    return this;
  }

  drawEmblemObj (EGobj) {
    this.setFlipsEG(EGobj.flags);

    const colorBg = EGobj.background_color || '#000000',
      color1 = EGobj.foreground_primary_color || '#FF0000',
      color2 = EGobj.foreground_secondary_color || '#FFFFFF';

    this.pto2_op = EGobj.black_opacity || this.pto2_op;

    const defFg = this.defs[EGobj.foreground_id] || '',
      defBg = this.bg_defs[EGobj.background_id] || '';

    this.drawEmblem(defFg, color1, color2, defBg, colorBg);
  }

  drawEmblem (defFg, color1, color2, defBg, colorBg) {
    const paper = this.paper;

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
    const paper = this.paper;
    let i;

    const scale = paper.width / this.base_size;
    let transformStr = (scale !== 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';

    if (this.flip > 3)
    {
      transformStr = transformStr.concat(' s',((this.flip & 8) !== 0) ? -1 : 1,',',((this.flip & 4) !== 0) ? -1 : 1,',',this.base_size/2,',',this.base_size/2);
    }

    this.paths = [];
    const paths = this.paths;
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
    const paper = this.paper;
    let i;
    const opacity = def.t ? this.bg_op : 1;

    const scale = paper.width / this.base_size;
    let transformStr = (scale !== 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';

    if ((this.flip & 1) !== 0 || (this.flip & 2) !== 0)
    {
      transformStr = transformStr.concat(' s',((this.flip & 2) !== 0) ? -1 : 1,',',((this.flip & 1) !== 0) ? -1 : 1,',',this.base_size/2,',',this.base_size/2);
    }

    this.bg_paths = [];

    const paths = this.bg_paths;
    if (def.p)
    {
      for(i=0;i<def.p.length;i++)
        paths[paths.length] = paper.path(def.p[i]).attr({'fill':color, 'stroke':'none', 'opacity': opacity}).transform(transformStr);
    }

    return paths;
  }

  setFlipsEG (flags) {
    this.flip = 0;

    for(let i=0; i<flags.length; i++)
    {
      if (this.flags_defs[flags[i]])
      {
        this.flip += this.flags_defs[flags[i]];
      }
    }
  }
}

export default EmblemGenerator
