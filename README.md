## Emblem Generator: JavaScript library to generate SVG emblems

Based on unmaintained repository [GW2Emblem](https://github.com/mtodor/gw2emblem) by Mladen Todorovic (mtodor@gmail.com)

### How to use!

#### In browser
Include `emblem-generator.js` file into HTML:

```
<script type="text/javascript" src="emblem-generator.js"></script>
```

#### In NodeJS environment
`import emblemGenerator from 'emblem-generator';`

#### Usage

Initiate emblemGenerator in empty div with the id 'emblem-div'

```
// 'emblem-div' is div ID and 256 is size of emblem in pixels
emblemGenerator.init('emblem-div', 256);
```

Display Emblem defined with object option:

```
emblemGenerator.drawEmblemObj({
	"background_id":1,
	"foreground_id":"star",
	"flags":[],
	"background_color_id":348,
	"foreground_primary_color_id":52,
	"foreground_secondary_color_id":113
});
```

#### Options

##### Assets

It's possible to use custom assets (instead of default assets) - it's sent as 3rd argument for init function call:

```
emblemGenerator.init('emblem-div', 128, myAssets);
```

`myAssets` var is an object in which you can define three different items:
- `defs`: the emblems
- `bg_defs`: the backgrounds
- `color_defs`: the colors

```
var myAssets = {
    defs: {},
    bg_defs: {},
    color_defs: {},
}
```

`defs` and `bg_defs` can be easily generated with the Asset Generator (see below). Demo custom assets are available in the `customAssets.js` file.

`color_defs` is an simple object defining a key and a color code:

```
const colors = {
  "1":"#ff0000","2":"#ff00ff","3":"#0000ff"
}
```

Demo custom colors are available in the `customColors.js` file. just add your own desired colors in it!

So, you can import these two demo files:
```
<script type="text/javascript" src="customAssets.js"></script>
<script type="text/javascript" src="customColors.js"></script>
```

Then define `myAssets` var like this:
```
var myAssets = {
    defs: assets.defs,
    bg_defs: assets.bg_defs,
    color_defs: colors
};
```

You can define one or many of these three items, if not define, default assets will be used.

You can leave it blank or set it to `default` to use the default assets.

##### Background

It's possible to use background color (instead of default image) - it's sent as 4th argument for init function call:
```
emblemGenerator.init('emblem-div', 128, 'default', 'transparent');
```
or
```
emblemGenerator.init('emblem-div', 128, 'default', #3682a0');
```

### Development

The point of the project is to provide an emblem generator with which you can add your own assets!

For this, I developed an Asset Generator to generate backgrounds and emblems from SVG files.

To use this Asset Generator, follow the guide ;)

#### Requirements

For the following parts, you will need:
- NodeJs
- Yarn (or NPM)

Once installed, get dependencies with the `yarn` command.

#### Asset Generator

##### Prepare the files
There are already demo assets in 'assets/backgrounds' and 'assets/emblems' folders. To add some assets, just add some SVG files in these folders.

The files have some requirements so that the Asset Generator works properly:
- The name of the file will be its ID (without the extension), so choose simple names without special characters
- SVG file should be 256x256
- SVG file should be as simple as possible: avoid transformations like 'scale' or 'translate' because only the path will be used 
- For backgrounds, `path` tags must be nested just below the `svg` tag. See the SVG files in `assets/backgrounds` folder for example
- For emblems, `path` tags must be nested just below the `svg` tag OR nested in a `g` tag to group paths by fill color. The `g` must be nested under the `svg` tag. See the SVG files in `assets/emblems` folder for example
- For emblems, the fill color will be used to determinate to which group belongs the shape. There are 4 different groups:
    - Primary color (use the `foreground_primary_color_id` option)
    - Secondary color (use the `foreground_secondary_color_id` option)
    - Secondary color transparent (use the `foreground_secondary_color_id` option with some opacity)
    - Black transparent (use black color with some opacity)
 
    So to determine in which group to dispatch the path, check this table:
    
    | Group                       | Color code                   |
    |-----------------------------|----------------------------|
    | Primary color               | #ff0000                    |
    | Secondary color             | #00ff00                    |
    | Secondary color transparent | #0000ff                    |
    | Black transparent           | #000000 or any other color |
    
    Once again, see the SVG files in `assets/emblems` folder for example
    
##### Generate the assets

Run `yarn generate-assets {path/to/assets} {path/to/export/folder}` to generate the `customAssets.js` file.

The `path/to/assets` folder must contains two sub-folder:
- `backgrounds` with the backgrounds SVG files
- `emblems` with the emblems SVG file

`path/to/export/folder` is where the file will be generated.

Example: `yarn generate-assets assets .` will generate the `customAssets.js` file in the base directory of this project

To use these custom assets in a ES6 project with 'import' syntax, the assets needs to be 'exported' with `export default assets` at the end of the file. To do this, just add 'true' as third argument of the command: `yarn generate-assets assets . true`

You will now be able to define the custom assets in the `init()` method (see upon) and to use them by passing their IDs (the SVG filename without the extension) to the object array in `drawEmblemObj()` method in your html file.

#### Modify the source code

If you want to modify the source code to your own needs, just check the files in `src` folder.

Any PR is welcome :)

##### Asset Generator

For the Asset Generator, modify the `src/asset-generator/AssetGenerator.js` file.

Then run `yarn build-asset-generator`. It uses babel to generate `util/AssetGenerator` that is used by the command `yarn generate-assets`

##### Emblem Generator

There are 4 source files for Emblem Generator:
- EmblemGenerator.js (main file based on the original project)
- assets.js (generated by the Asset Generator)
- colors.js (where all the colors used are defined)
- index.js (to instanciate the Emblem Generator)

I you make any change to one of those files (in fact, you should'nt have to modify `assets.js` that is a generated file), you should run `yarn build` to regenerate `emblem-generator.js`

### Author

Benoît Ripoche - Kiplin

benoit.ripoche@kiplin.com
