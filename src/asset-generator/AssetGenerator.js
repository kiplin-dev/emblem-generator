import fs from 'fs'
import path from 'path'
import extract from 'extract-svg-path'
import { parse } from 'svg-parser'
import regeneratorRuntime from "regenerator-runtime"

class AssetGenerator {
  async generate() {

    let assets = 'const assets = {}\n\n'

    const bgDefs = await this._generateBgDefs()
    const defs = await this._generateDefs()

    assets += bgDefs
    assets += defs

    assets += '\n\nexport default assets;'

    fs.writeFile('src/emblem-generator/assets.js', assets, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log('Assets successfully generated!');
    });
  }

  _generateDefs() {
    return new Promise((resolve, reject) => {
      // EMBLEMS
      const emblemsPath = path.join(__dirname, '../assets/emblems/')

      fs.readdir(emblemsPath, async (err, files) => {
        if (err) throw err;

        let defs = 'assets.defs = {';

        let i = 0
        for (const fileName of files) {
          defs += `"${fileName.slice(0, -4)}":{"size":256,`

          const filePath = path.join(emblemsPath, fileName)

          const data =  fs.readFileSync(filePath, {encoding:'utf8', flag:'r'})
          const svgObj = parse(data)

          const p2 = []
          const p1 = []
          const pt1 = []
          const pto2 = []

          for (const child of svgObj.children) {
            for (const c of child.children) {
              // if paths are grouped by filled color
              if ('g' == c.tagName && c.properties.fill) {
                for (const cc of c.children) {
                  if ('path' === cc.tagName) {
                    this._dispatchPath(cc.properties.d, c.properties.fill, p2, p1, pt1, pto2)
                  }
                }
              }
              // if paths get their own filled color
              if ('path' === c.tagName) {
                this._dispatchPath(c.properties.d, c.properties.fill, p2, p1, pt1, pto2)
              }
            }
          }
          const comma = (i+1) === files.length ? '' : ','
          defs += `"p2":[${p2}],"p1":[${p1}],"pt1":[${pt1}],"pto2":[${pto2}]}${comma}`;
          i++
        }
        defs += '};'

        resolve(defs)
      })
    })
  }

  _generateBgDefs() {
    return new Promise((resolve, reject) => {
      // BACKGROUNDS
      const bgPath = path.join(__dirname, '../assets/backgrounds/')

      fs.readdir(bgPath, (err, files) => {
        if (err) throw err

        let bgDefs = 'assets.bg_defs = {'
        bgDefs += '"0":{"size":256,"t":false,"p":""},'

        let i = 0
        for (const fileName of files) {
          const filePath = path.join(bgPath, fileName)
          const svgPath = extract(filePath)

          const comma = (i+1) === files.length ? '' : ','

          bgDefs += `"${fileName.slice(0, -4)}":{"size":256,"t":true,"p":["${svgPath}"]}${comma}`
          i++
        }

        bgDefs += '};\n\n'

        resolve(bgDefs)
      });
    })
  }

  _dispatchPath(path, fill, p2, p1, pt1, pto2) {
    switch (fill) {
      // Primary Color
      case '#ff0000':
        p2.push(`"${path}"`)
        break
      // Secondary Color
      case '#00ff00':
        p1.push(`"${path}"`)
        break
      // Secondary Color Transparent
      case '#0000ff':
        pt1.push(`"${path}"`)
        break
      // Default - Black transparent
      default:
        pto2.push(`"${path}"`)
        break
    }
  }
}

const assetGenerator = new AssetGenerator()

assetGenerator.generate()

