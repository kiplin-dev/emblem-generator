'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _extractSvgPath = require('extract-svg-path');

var _extractSvgPath2 = _interopRequireDefault(_extractSvgPath);

var _svgParser = require('svg-parser');

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssetGenerator = function () {
  function AssetGenerator() {
    _classCallCheck(this, AssetGenerator);
  }

  _createClass(AssetGenerator, [{
    key: 'generate',
    value: async function generate() {

      var assets = 'const assets = {}\n\n';

      var bgDefs = await this._generateBgDefs();
      var defs = await this._generateDefs();

      assets += bgDefs;
      assets += defs;

      _fs2.default.writeFile('customAssets.js', assets, function (err) {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('Assets successfully generated!');
      });
    }
  }, {
    key: '_generateDefs',
    value: function _generateDefs() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        // EMBLEMS
        var emblemsPath = _path2.default.join(__dirname, '../assets/emblems/');

        _fs2.default.readdir(emblemsPath, async function (err, files) {
          if (err) throw err;

          var defs = 'assets.defs = {';

          var i = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var fileName = _step.value;

              defs += '"' + fileName.slice(0, -4) + '":{"size":256,';

              var filePath = _path2.default.join(emblemsPath, fileName);

              var data = _fs2.default.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
              var svgObj = (0, _svgParser.parse)(data);

              var p2 = [];
              var p1 = [];
              var pt1 = [];
              var pto2 = [];

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = svgObj.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var child = _step2.value;
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = child.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var c = _step3.value;

                      // if paths are grouped by filled color
                      if ('g' == c.tagName && c.properties.fill) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                          for (var _iterator4 = c.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var cc = _step4.value;

                            if ('path' === cc.tagName) {
                              _this._dispatchPath(cc.properties.d, c.properties.fill, p2, p1, pt1, pto2);
                            }
                          }
                        } catch (err) {
                          _didIteratorError4 = true;
                          _iteratorError4 = err;
                        } finally {
                          try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                              _iterator4.return();
                            }
                          } finally {
                            if (_didIteratorError4) {
                              throw _iteratorError4;
                            }
                          }
                        }
                      }
                      // if paths get their own filled color
                      if ('path' === c.tagName) {
                        _this._dispatchPath(c.properties.d, c.properties.fill, p2, p1, pt1, pto2);
                      }
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              var comma = i + 1 === files.length ? '' : ',';
              defs += '"p2":[' + p2 + '],"p1":[' + p1 + '],"pt1":[' + pt1 + '],"pto2":[' + pto2 + ']}' + comma;
              i++;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          defs += '};';

          resolve(defs);
        });
      });
    }
  }, {
    key: '_generateBgDefs',
    value: function _generateBgDefs() {
      return new Promise(function (resolve, reject) {
        // BACKGROUNDS
        var bgPath = _path2.default.join(__dirname, '../assets/backgrounds/');

        _fs2.default.readdir(bgPath, function (err, files) {
          if (err) throw err;

          var bgDefs = 'assets.bg_defs = {';
          bgDefs += '"0":{"size":256,"t":false,"p":""},';

          var i = 0;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = files[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var fileName = _step5.value;

              var filePath = _path2.default.join(bgPath, fileName);
              var svgPath = (0, _extractSvgPath2.default)(filePath);

              var comma = i + 1 === files.length ? '' : ',';

              bgDefs += '"' + fileName.slice(0, -4) + '":{"size":256,"t":true,"p":["' + svgPath + '"]}' + comma;
              i++;
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          bgDefs += '};\n\n';

          resolve(bgDefs);
        });
      });
    }
  }, {
    key: '_dispatchPath',
    value: function _dispatchPath(path, fill, p2, p1, pt1, pto2) {
      switch (fill) {
        // Primary Color
        case '#ff0000':
          p2.push('"' + path + '"');
          break;
        // Secondary Color
        case '#00ff00':
          p1.push('"' + path + '"');
          break;
        // Secondary Color Transparent
        case '#0000ff':
          pt1.push('"' + path + '"');
          break;
        // Default - Black transparent
        default:
          pto2.push('"' + path + '"');
          break;
      }
    }
  }]);

  return AssetGenerator;
}();

var assetGenerator = new AssetGenerator();

assetGenerator.generate();