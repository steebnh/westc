"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueHtmlPanelCtrl = void 0;

var _sdk = require("app/plugins/sdk");

var _lodash = _interopRequireDefault(require("lodash"));

var JS = _interopRequireWildcard(require("./external/YourJS.min"));

var _helperFunctions = require("./helper-functions");

var Vue = _interopRequireWildcard(require("./external/vue.min"));

var _config = _interopRequireDefault(require("app/core/config"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var SEL_DISABLE_DOWNLOAD_CSV = '<llow-csv><ble-csv><llow-download><ble-download>'.replace(/<(.+?)>/g, ':not([data-disa$1])');
var DEFAULT_PANEL_SETTINGS = {
  html: '<h2>Output of available datasets:</h2>\n<div><pre>{{ JSON.stringify(dataset, null, 2) }}</pre></div>',
  css: '& {\n  overflow: auto;\n}',
  canDownloadDatasets: true,
  emType: null,
  refreshRate: null
};
var REFRESH_RATE_OPTIONS = [{
  value: null,
  text: 'Never'
}, {
  value: 1,
  text: 'Every second'
}, {
  value: 60,
  text: 'Every minute'
}];
var EM_TYPES = [{
  value: null,
  text: 'Default'
}, {
  value: 'CONTENT-HEIGHT',
  text: 'Content Height'
}, {
  value: 'CONTENT-WIDTH',
  text: 'Content Width'
}, {
  value: 'CONTENT-MIN-DIM',
  text: 'Minimum Content Dimension'
}, {
  value: 'CONTENT-MAX-DIM',
  text: 'Maximum Content Dimension'
}, {
  value: 'CONTENT-AVG-DIM',
  text: 'Average of Content Dimensions'
}];

function normalizeHasher(hasher) {
  var hasherType = _typeof(hasher);

  return 'function' === hasherType ? hasher : 'string' === hasherType ? function (row) {
    return JSON.stringify(row[hasher]);
  } : function (row) {
    return JSON.stringify(hasher.map(function (item) {
      return row[item];
    }));
  };
}

var VueHtmlPanelCtrl =
/*#__PURE__*/
function (_MetricsPanelCtrl) {
  _inherits(VueHtmlPanelCtrl, _MetricsPanelCtrl);

  function VueHtmlPanelCtrl($scope, $injector, $rootScope) {
    var _this;

    _classCallCheck(this, VueHtmlPanelCtrl);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VueHtmlPanelCtrl).call(this, $scope, $injector));
    _this.$rootScope = $rootScope;

    _lodash.default.defaultsDeep(_this.panel, DEFAULT_PANEL_SETTINGS); // If panel.emIsContentHeight was used, convert it to panel.emType.


    var emIsContentHeight = _this.panel.emIsContentHeight;

    if (emIsContentHeight != null) {
      _this.panel.emType = emIsContentHeight ? 'CONTENT-HEIGHT' : null;
      delete _this.panel.emIsContentHeight;
    }

    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_assertThisInitialized(_this)));

    _this.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this)));

    _this.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_assertThisInitialized(_this)));

    _this.events.on('view-mode-changed', _this.onViewModeChanged.bind(_assertThisInitialized(_this)));

    _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_assertThisInitialized(_this))); // Additional events that we can hook into...
    // this.events.on('component-did-mount', this.onComponentDidMount.bind(this));
    // this.events.on('panel-size-changed', this.onPanelSizeChanged.bind(this));
    // this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    // this.events.on('refresh', this.onRefresh.bind(this));
    // this.events.on('render', this.onRender.bind(this));


    return _this;
  }

  _createClass(VueHtmlPanelCtrl, [{
    key: "renderError",
    value: function renderError(title, message, isMonospace) {
      this.panelElement.html('').append(JS.dom({
        _: 'div',
        style: {
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%'
        },
        $: [{
          _: 'div',
          cls: 'alert alert-error',
          style: {
            margin: '0px auto'
          },
          $: {
            _: 'div',
            $: [{
              _: 'h2',
              style: {
                color: '#FFF'
              },
              text: title
            }, {
              _: isMonospace ? 'pre' : 'div',
              text: message
            }]
          }
        }]
      }));
    }
    /**
     * Executed when panel actions should be loaded.
     * @param {*} actions Actions to be added.
     */

  }, {
    key: "onInitPanelActions",
    value: function onInitPanelActions(actions) {
      var tablesSubmenu = this.panelElement.find('table').toArray().reduce(function (carry, table, index) {
        if (jQuery(table).is(SEL_DISABLE_DOWNLOAD_CSV)) {
          carry.push({
            text: table.getAttribute('data-title') ? "Export \"".concat(table.getAttribute('data-title'), "\" As CSV") : "Export Table #".concat(index + 1, " As CSV"),
            icon: 'fa fa-fw fa-table',
            click: "ctrl.csvifyTable(".concat(index, ")")
          });
        }

        return carry;
      }, []);

      if (tablesSubmenu.length) {
        actions.push.apply(actions, [{
          divider: true,
          role: 'Editor'
        }].concat(tablesSubmenu));
      }

      if (this.panel.canDownloadDatasets) {
        var datasetsSubmenu = this.dataset.reduce(function (carry, data, index) {
          var raw = data.raw;

          if (raw.type === 'table' && raw.columns.length) {
            carry.push({
              text: "Export Dataset \"".concat(raw.refId, "\" As CSV"),
              icon: 'fa fa-fw fa-database',
              click: "ctrl.csvifyDataset(".concat(index, ")")
            });
          }

          return carry;
        }, []);

        if (datasetsSubmenu.length) {
          actions.push.apply(actions, [{
            divider: true,
            role: 'Editor'
          }].concat(datasetsSubmenu));
        }
      }
    }
    /**
     * Executed before showing edit mode.
     */

  }, {
    key: "onInitEditMode",
    value: function onInitEditMode() {
      var path = 'public/plugins/westc-vuehtml-panel/partials/';
      this.addEditorTab('Editor', "".concat(path, "editor.html"), 1);
    }
    /**
     * Executed when the view mode of the panel changes between edit and view.
     */

  }, {
    key: "onViewModeChanged",
    value: function onViewModeChanged() {
      this.logVueScope();
    }
  }, {
    key: "csvifyDataset",
    value: function csvifyDataset(datasetIndex) {
      var data = this.dataset[datasetIndex];
      var columnNames = data.columnNames,
          rows = data.rows;
      JS.dom({
        _: 'a',
        href: 'data:text/csv;charset=utf-8,' + encodeURIComponent((0, _helperFunctions.toCSV)(rows.map(function (row) {
          return columnNames.map(function (cName) {
            return row[cName];
          });
        }), {
          headers: columnNames
        })),
        download: this.panel.title + JS.formatDate(new Date(), " (YYYY-MM-DD 'at' H.mm.ss)") + ".dataset-".concat(data.raw.refId, ".csv")
      }).click();
    }
  }, {
    key: "csvifyTable",
    value: function csvifyTable(index) {
      var table = this.panelElement.find('table').toArray()[index];
      var title = table.getAttribute('data-title') || this.panel.title + " Table ".concat(index + 1);
      JS.dom({
        _: 'a',
        href: 'data:text/csv;charset=utf-8,' + encodeURIComponent((0, _helperFunctions.toCSV)((0, _helperFunctions.tableToArray)(table))),
        download: title + JS.formatDate(new Date(), " (YYYY-MM-DD 'at' H.mm.ss)") + ".csv"
      }).click();
    }
    /**
     * Adds the Vue scope to the console log if in editing mode.
     */

  }, {
    key: "logVueScope",
    value: function logVueScope() {
      // If in editing mode show the html scope.
      if (this.panel.isEditing) {
        console.log('Data values available:', this.getVueScope());
      }
    }
  }, {
    key: "render",
    value: function render() {
      // If an `em` unit is supposed to be based on the size of the content area
      // make sure to recalculate it.
      var jElemPC = this.panelElement;
      var emType = this.panel.emType;
      var size = 'CONTENT-HEIGHT' === emType ? jElemPC.height() : 'CONTENT-WIDTH' === emType ? jElemPC.width() : 'CONTENT-MIN-DIM' === emType ? Math.min(jElemPC.height(), jElemPC.width()) : 'CONTENT-MAX-DIM' === emType ? Math.max(jElemPC.height(), jElemPC.width()) : 'CONTENT-AVG-DIM' === emType ? (jElemPC.height() + jElemPC.width()) / 2 : null;
      jElemPC.css('font-size', size != null ? size + 'px' : '');
    }
    /**
     * Should only be called when the panel should re-rendered fresh.  Not defined
     * as render because there is no need to re-render every time the window
     * resizes or the panel resizes.
     */

  }, {
    key: "updateView",
    value: function updateView() {
      var ctrl = this;
      var jElemPC = ctrl.panelElement;
      var elemPC = jElemPC[0];
      var elem = JS.dom({
        _: 'div'
      });
      var panel = ctrl.panel;
      var cls = ('_' + Math.random()).replace(/0\./, +new Date());
      this.render(); // Recalculates `em` size if it is supposed to.

      jElemPC.html('').append(elem);
      elemPC.className = elemPC.className.replace(/(^|\s+)_\d+(?=\s+|$)/g, ' ').trim() + ' ' + cls; // Data available to the HTML code.

      var vueScope = ctrl.getVueScope();

      if (ctrl.vue) {
        ctrl.vue.$destroy();
      }

      ctrl.vue = new Vue({
        template: "<div>".concat(panel.html, "</div>"),
        el: elem,
        data: vueScope,
        mounted: function mounted() {
          // Remove the old stylesheet from the document if it exists.
          var stylesheet = ctrl.stylesheet;
          var styleParent = stylesheet && stylesheet.parentNode;

          if (styleParent) {
            styleParent.removeChild(stylesheet);
          } // Add the nested CSS to the panel.


          ctrl.stylesheet = JS.css(JSON.parse((0, _helperFunctions.pseudoCssToJSON)(panel.css)), '.' + cls);
        },
        methods: {
          onError: function onError(err, info) {
            ctrl.renderError('VueJS Error', err.message, true);
            console.error('VueHtmlPanelCtrl error:', {
              err: err,
              info: info
            });
          },
          keyRows: function keyRows(rows, hasher) {
            hasher = normalizeHasher(hasher);
            return rows.reduce(function (carry, row) {
              var key = hasher(row);
              carry[key] = _lodash.default.has(carry, key) ? carry[key].concat([row]) : [row];
              return carry;
            }, {});
          },
          indexRows: function indexRows(rows, hasher) {
            hasher = normalizeHasher(hasher);
            var keys = rows.map(function (row) {
              return hasher(row);
            });

            var uniqueKeys = _lodash.default.uniq(keys);

            return rows.reduce(function (carry, row, rowIndex) {
              var realIndex = uniqueKeys.indexOf(keys[rowIndex]);
              carry[realIndex] = _lodash.default.has(carry, realIndex) ? carry[realIndex].concat([row]) : [row];
              return carry;
            }, []);
          }
        }
      });
      var refreshRate = ctrl.panel.refreshRate;

      if (refreshRate > 0 && ~~refreshRate === refreshRate) {
        // Make sure that panel only gets refreshed according to the specified
        // interval.
        if (ctrl.refreshTimeout) {
          clearTimeout(ctrl.refreshTimeout);
          ctrl.refreshTimeout = null;
        }

        ctrl.refreshTimeout = setTimeout(function () {
          // Only update if the refresh rate remains unchanged
          if (refreshRate === ctrl.panel.refreshRate) {
            ctrl.updateView();
          }
        }, refreshRate * 1e3);
      }
    }
    /**
     * Gets the object containing the variables available to the Vue HTML.
     * @returns {Object}
     *   The Vue scope that is made available to the Vue HTML.
     */

  }, {
    key: "getVueScope",
    value: function getVueScope() {
      var ctrl = this;
      return _lodash.default.cloneDeep({
        dataset: ctrl.dataset,
        datasets: ctrl.datasets,
        datasetsById: ctrl.datasetsById,
        panel: ctrl.panel.getOptionsToRemember(),
        JS: JS,
        themeType: _config.default.theme.type,
        url: {
          encode: function encode(value) {
            return encodeURIComponent(value + '').replace(/%20/g, '+');
          },
          decode: function decode(value) {
            return decodeURIComponent((value + '').replace(/\+/g, '%20'));
          },
          toParams: function toParams(objValues, opt_prefixVar) {
            var _this2 = this;

            return Object.entries(objValues).reduce(function (arrParams, _ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  key = _ref2[0],
                  value = _ref2[1];

              return arrParams.concat(JS.toArray(value).map(function (value) {
                return _this2.encode((opt_prefixVar ? 'var-' : '') + key) + '=' + _this2.encode(value);
              }));
            }, []).join('&');
          },
          getTimeValues: function getTimeValues(opt_name) {
            var result = {};
            var time = ctrl.timeSrv.time;

            if (opt_name != 'to') {
              result.from = time.from;
            }

            if (opt_name != 'from') {
              result.to = time.to;
            }

            return result;
          },
          getTimeParams: function getTimeParams(opt_name) {
            return this.toParams(this.getTimeValues(opt_name));
          },
          getVarValues: function getVarValues(opt_filter, opt_negate) {
            if (opt_filter && 'function' !== typeof opt_filter) {
              var arrFilter = JS.toArray(opt_filter);

              opt_filter = function opt_filter(key) {
                return arrFilter.some(function (filter) {
                  return filter instanceof RegExp ? filter.test(key) : filter == key;
                });
              };
            }

            return ctrl.templateSrv.variables.reduce(function (values, variable) {
              // At times current.value is a string and at times it is an array.
              var key = variable.name;
              var varValues = JS.toArray(variable.current.value);
              var isAll = variable.includeAll && varValues.length === 1 && varValues[0] === '$__all';
              varValues = isAll ? [variable.current.text] : varValues;

              if (opt_filter) {
                varValues = varValues.filter(function (value) {
                  return !!opt_filter(key, value) === !opt_negate;
                });
              }

              if (varValues.length) {
                values[key] = varValues;
              }

              return values;
            }, {});
          },
          getVarParams: function getVarParams(opt_filter, opt_negate) {
            return this.toParams(this.getVarValues(opt_filter, opt_negate), true);
          }
        },
        offsetDateTZ: function offsetDateTZ(date, opt_tzOffset) {
          date = new Date(date);
          opt_tzOffset = opt_tzOffset == null ? date.getTimezoneOffset() : opt_tzOffset;
          return new Date(+date + opt_tzOffset * 6e4);
        }
      });
    }
  }, {
    key: "onDataError",
    value: function onDataError(event) {
      this.renderError(event.statusText, event.data.message, true);
    }
    /**
     * Executed whenever data is received from the database for this panel.
     * @param {Array} dataList 
     *   An array of objects containing the data that is collected from the
     *   database.
     */

  }, {
    key: "onDataReceived",
    value: function onDataReceived(dataList, a, b) {
      var _this3 = this;

      this.datasets = this.dataset = [];
      this.datasetsById = {};

      if (dataList) {
        var datasetNames = [];
        dataList.forEach(function (data) {
          var refId = data.refId,
              datapoints = data.datapoints,
              target = data.target,
              columns = data.columns,
              rows = data.rows;
          var datasetIndex = datasetNames.indexOf(refId);
          var dataset;

          if (data.type === 'table') {
            var colNames = columns.map(function (c) {
              return 'string' === typeof c ? c : c.text;
            });
            _this3.datasetsById[refId] = dataset = {
              columnNames: colNames,
              rows: rows.map(function (row) {
                return row.reduceRight(function (carry, cell, cellIndex) {
                  carry[colNames[cellIndex]] = cell;
                  return carry;
                }, {});
              }),
              raw: data
            };
          } else {
            dataset = _this3.datasetsById[refId] = _this3.datasetsById[refId] || {
              columnNames: ['value', 'time', 'metric'],
              rows: [],
              raw: [],
              refId: refId
            };
            datapoints.forEach(function (row) {
              dataset.rows.push(row.slice(0, 2).concat([target]));
            });

            if (JS.typeOf(dataset.raw) === 'Array') {
              dataset.raw.push(data);
            }
          }

          if (datasetIndex < 0) {
            datasetIndex = datasetNames.push(refId) - 1;
            _this3.datasets[datasetIndex] = _this3.dataset[datasetIndex] = dataset;
          }
        });
      }

      this.updateView();
      this.logVueScope();
    }
  }, {
    key: "link",
    value: function link(scope, elem, attrs, ctrl) {
      this.element = elem;
      this.panelElement = elem.find('.panel-content');
    }
  }]);

  return VueHtmlPanelCtrl;
}(_sdk.MetricsPanelCtrl); // Allows for error handling in vueToHTML().


exports.VueHtmlPanelCtrl = VueHtmlPanelCtrl;

Vue.config.errorHandler = function (err, vm, info) {
  if (vm && vm.onError) {
    vm.onError(err, info);
  }
};

VueHtmlPanelCtrl.prototype.REFRESH_RATE_OPTIONS = REFRESH_RATE_OPTIONS;
VueHtmlPanelCtrl.prototype.EM_TYPES = EM_TYPES;
VueHtmlPanelCtrl.templateUrl = 'partials/module.html';
//# sourceMappingURL=ctrl.js.map
