/*!
 * BootstrapVue 2.6.0
 *
 * @link https://bootstrap-vue.js.org
 * @source https://github.com/bootstrap-vue/bootstrap-vue
 * @copyright (c) 2016-2020 BootstrapVue
 * @license MIT
 * https://github.com/bootstrap-vue/bootstrap-vue/blob/master/LICENSE
 */

import Vue from 'vue';
import { mergeData } from 'vue-functional-data-merge';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

//

// --- Static ---
var isArray = function isArray(val) {
  return Array.isArray(val);
}; // --- Instance ---

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */

var isPlainObject = function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * Utilities to get information about the current environment
 */
// --- Constants ---
var hasWindowSupport = typeof window !== 'undefined';
var hasDocumentSupport = typeof document !== 'undefined';
var hasNavigatorSupport = typeof navigator !== 'undefined';
var isBrowser = hasWindowSupport && hasDocumentSupport && hasNavigatorSupport; // Browser type sniffing

var userAgent = isBrowser ? window.navigator.userAgent.toLowerCase() : '';
var isJSDOM = userAgent.indexOf('jsdom') > 0;
var isIE = /msie|trident/.test(userAgent); // Determine if the browser supports the option passive for events

var hasPassiveEventSupport = function () {
  var passiveEventSupported = false;

  if (isBrowser) {
    try {
      var options = {
        get passive() {
          // This function will be called when the browser
          // attempts to access the passive property.

          /* istanbul ignore next: will never be called in JSDOM */
          passiveEventSupported = true;
        }

      };
      window.addEventListener('test', options, options);
      window.removeEventListener('test', options, options);
    } catch (err) {
      /* istanbul ignore next: will never be called in JSDOM */
      passiveEventSupported = false;
    }
  }

  return passiveEventSupported;
}();

var getEnv = function getEnv(key) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var env = typeof process !== 'undefined' && process ? process.env || {} : {};

  if (!key) {
    /* istanbul ignore next */
    return env;
  }

  return env[key] || fallback;
};
var getNoWarn = function getNoWarn() {
  return getEnv('BOOTSTRAP_VUE_NO_WARN');
};

var isUndefined = function isUndefined(val) {
  return val === undefined;
};
var isNull = function isNull(val) {
  return val === null;
};
var isUndefinedOrNull = function isUndefinedOrNull(val) {
  return isUndefined(val) || isNull(val);
};

// String utilities
var RX_UN_KEBAB = /-(\w)/g;
var RX_HYPHENATE = /\B([A-Z])/g; // --- Utilities ---
// Converts PascalCase or camelCase to kebab-case

var kebabCase = function kebabCase(str) {
  return str.replace(RX_HYPHENATE, '-$1').toLowerCase();
}; // Converts a kebab-case or camelCase string to PascalCase

var pascalCase = function pascalCase(str) {
  str = kebabCase(str).replace(RX_UN_KEBAB, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}; // Lowercases the first letter of a string and returns a new string
// `undefined`/`null` will be converted to `''`
// Plain objects and arrays will be JSON stringified

var toString = function toString(val) {
  var spaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  return isUndefinedOrNull(val) ? '' : isArray(val) || isPlainObject(val) && val.toString === Object.prototype.toString ? JSON.stringify(val, null, spaces) : String(val);
}; // Remove leading white space from a string

var trim = function trim(str) {
  return toString(str).trim();
}; // Lower case a string

var identity = function identity(x) {
  return x;
};

// Number utilities
// Returns NaN if the value cannot be converted

var toFloat = function toFloat(val) {
  return parseFloat(val);
}; // Converts a value (string, number, etc) to a string

var commonIconProps = {
  variant: {
    type: String,
    default: null
  },
  fontScale: {
    type: [Number, String],
    default: 1
  },
  scale: {
    type: [Number, String],
    default: 1
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  flipH: {
    type: Boolean,
    default: false
  },
  flipV: {
    type: Boolean,
    default: false
  },
  shiftH: {
    type: [Number, String],
    default: 0
  },
  shiftV: {
    type: [Number, String],
    default: 0
  }
}; // Base attributes needed on all icons

var baseAttrs = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 20 20',
  focusable: 'false',
  role: 'img',
  alt: 'icon'
}; // Shared private base component to reduce bundle/runtime size
// @vue/component

var BVIconBase = /*#__PURE__*/Vue.extend({
  name: 'BVIconBase',
  functional: true,
  props: _objectSpread2({
    content: {
      type: String
    },
    stacked: {
      type: Boolean,
      default: false
    }
  }, commonIconProps),
  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        children = _ref.children;
    var fontScale = Math.max(toFloat(props.fontScale) || 1, 0) || 1;
    var scale = Math.max(toFloat(props.scale) || 1, 0) || 1;
    var rotate = toFloat(props.rotate) || 0;
    var shiftH = toFloat(props.shiftH) || 0;
    var shiftV = toFloat(props.shiftV) || 0;
    var flipH = props.flipH;
    var flipV = props.flipV; // Compute the transforms
    // Note that order is important as SVG transforms are applied in order from
    // left to right and we want flipping/scale to occur before rotation
    // Note shifting is applied separately
    // Assumes that the viewbox is `0 0 20 20` (`10 10` is the center)

    var hasScale = flipH || flipV || scale !== 1;
    var hasTransforms = hasScale || rotate;
    var hasShift = shiftH || shiftV;
    var transforms = [hasTransforms ? 'translate(10 10)' : null, hasScale ? "scale(".concat((flipH ? -1 : 1) * scale, " ").concat((flipV ? -1 : 1) * scale, ")") : null, rotate ? "rotate(".concat(rotate, ")") : null, hasTransforms ? 'translate(-10 -10)' : null].filter(identity); // Handling stacked icons

    var isStacked = props.stacked;
    var hasContent = !isUndefinedOrNull(props.content); // We wrap the content in a `<g>` for handling the transforms (except shift)

    var $inner = h('g', {
      attrs: {
        transform: transforms.join(' ') || null
      },
      domProps: hasContent ? {
        innerHTML: props.content || ''
      } : {}
    }, children); // If needed, we wrap in an additional `<g>` in order to handle the shifting

    if (hasShift) {
      $inner = h('g', {
        attrs: {
          transform: "translate(".concat(20 * shiftH / 16, " ").concat(-20 * shiftV / 16, ")")
        }
      }, [$inner]);
    }

    return h('svg', mergeData({
      staticClass: 'b-icon bi',
      class: _defineProperty({}, "text-".concat(props.variant), !!props.variant),
      attrs: baseAttrs,
      style: isStacked ? {} : {
        fontSize: fontScale === 1 ? null : "".concat(fontScale * 100, "%")
      }
    }, // Merge in user supplied data
    data, // If icon is stacked, null out some attrs
    isStacked ? {
      attrs: {
        width: null,
        height: null,
        role: null,
        alt: null
      }
    } : {}, // These cannot be overridden by users
    {
      attrs: {
        xmlns: isStacked ? null : 'http://www.w3.org/2000/svg',
        fill: 'currentColor'
      }
    }), [$inner]);
  }
});

/**
 * Icon component generator function
 *
 * @param {string} icon name (minus the leading `BIcon`)
 * @param {string} raw `innerHTML` for SVG
 * @return {VueComponent}
 */

var makeIcon = function makeIcon(name, content) {
  // For performance reason we pre-compute some values, so that
  // they are not computed on each render of the icon component
  var iconName = "BIcon".concat(pascalCase(name));
  var iconNameClass = "bi-".concat(kebabCase(name));
  var svgContent = trim(content || ''); // Return the icon component definition

  return (/*#__PURE__*/Vue.extend({
      name: iconName,
      functional: true,
      props: _objectSpread2({}, commonIconProps, {
        stacked: {
          type: Boolean,
          default: false
        }
      }),
      render: function render(h, _ref) {
        var data = _ref.data,
            props = _ref.props;
        return h(BVIconBase, mergeData(data, {
          staticClass: iconNameClass,
          props: _objectSpread2({}, props, {
            content: svgContent
          })
        }));
      }
    })
  );
};

// --- BEGIN AUTO-GENERATED FILE ---

var BIconBlank = /*#__PURE__*/makeIcon('Blank', ''); // --- Bootstrap Icons ---

var BIconAlarm = /*#__PURE__*/makeIcon('Alarm', '<path fill-rule="evenodd" d="M10 17a6 6 0 100-12 6 6 0 000 12zm0 1a7 7 0 100-14 7 7 0 000 14z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 6.5a.5.5 0 01.5.5v4a.5.5 0 01-.053.224l-1.5 3a.5.5 0 11-.894-.448L9.5 10.882V7a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path d="M2.86 7.387A2.5 2.5 0 116.387 3.86 8.035 8.035 0 002.86 7.387zM13.613 3.86a2.5 2.5 0 113.527 3.527 8.035 8.035 0 00-3.527-3.527z"/><path fill-rule="evenodd" d="M13.646 16.146a.5.5 0 01.708 0l1 1a.5.5 0 01-.708.708l-1-1a.5.5 0 010-.708zm-7.292 0a.5.5 0 00-.708 0l-1 1a.5.5 0 00.708.708l1-1a.5.5 0 000-.708zM7.5 2.5A.5.5 0 018 2h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path d="M9 3h2v2H9V3z"/>');
var BIconAlarmFill = /*#__PURE__*/makeIcon('AlarmFill', '<path fill-rule="evenodd" d="M7.5 2.5A.5.5 0 018 2h4a.5.5 0 010 1h-1v1.07a7.002 7.002 0 013.537 12.26l.817.816a.5.5 0 01-.708.708l-.924-.925A6.967 6.967 0 0110 18a6.967 6.967 0 01-3.722-1.07l-.924.924a.5.5 0 01-.708-.708l.817-.816A7.002 7.002 0 019 4.07V3H8a.5.5 0 01-.5-.5zM2.86 7.387A2.5 2.5 0 116.387 3.86 8.035 8.035 0 002.86 7.387zM15.5 3c-.753 0-1.429.333-1.887.86a8.035 8.035 0 013.527 3.527A2.5 2.5 0 0015.5 3zm-5 4a.5.5 0 00-1 0v3.882l-1.447 2.894a.5.5 0 10.894.448l1.5-3A.5.5 0 0010.5 11V7z" clip-rule="evenodd"/>');
var BIconAlertCircle = /*#__PURE__*/makeIcon('AlertCircle', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/><path d="M9.002 13a1 1 0 112 0 1 1 0 01-2 0zM9.1 6.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 6.995z"/>');
var BIconAlertCircleFill = /*#__PURE__*/makeIcon('AlertCircleFill', '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.998 3a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clip-rule="evenodd"/>');
var BIconAlertOctagon = /*#__PURE__*/makeIcon('AlertOctagon', '<path fill-rule="evenodd" d="M6.54 2.146A.5.5 0 016.893 2h6.214a.5.5 0 01.353.146l4.394 4.394a.5.5 0 01.146.353v6.214a.5.5 0 01-.146.353l-4.394 4.394a.5.5 0 01-.353.146H6.893a.5.5 0 01-.353-.146L2.146 13.46A.5.5 0 012 13.107V6.893a.5.5 0 01.146-.353L6.54 2.146zM7.1 3L3 7.1v5.8L7.1 17h5.8l4.1-4.1V7.1L12.9 3H7.1z" clip-rule="evenodd"/><rect width="2" height="2" x="9.002" y="12" rx="1"/><path d="M9.1 6.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 6.995z"/>');
var BIconAlertOctagonFill = /*#__PURE__*/makeIcon('AlertOctagonFill', '<path fill-rule="evenodd" d="M13.107 2a.5.5 0 01.353.146l4.394 4.394a.5.5 0 01.146.353v6.214a.5.5 0 01-.146.353l-4.394 4.394a.5.5 0 01-.353.146H6.893a.5.5 0 01-.353-.146L2.146 13.46A.5.5 0 012 13.107V6.893a.5.5 0 01.146-.353L6.54 2.146A.5.5 0 016.893 2h6.214zM9.002 13a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clip-rule="evenodd"/>');
var BIconAlertSquare = /*#__PURE__*/makeIcon('AlertSquare', '<path fill-rule="evenodd" d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/><rect width="2" height="2" x="9.002" y="12" rx="1"/><path d="M9.1 6.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 6.995z"/>');
var BIconAlertSquareFill = /*#__PURE__*/makeIcon('AlertSquareFill', '<path fill-rule="evenodd" d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm7.002 9a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clip-rule="evenodd"/>');
var BIconAlertTriangle = /*#__PURE__*/makeIcon('AlertTriangle', '<path fill-rule="evenodd" d="M9.938 4.016a.146.146 0 00-.054.057L3.027 15.74a.176.176 0 00-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 00.066-.017.163.163 0 00.055-.06.176.176 0 00-.003-.183L10.12 4.073a.146.146 0 00-.054-.057.13.13 0 00-.063-.016.13.13 0 00-.064.016zm1.043-.45a1.13 1.13 0 00-1.96 0L2.166 15.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L10.982 3.566z" clip-rule="evenodd"/><rect width="2" height="2" x="9.002" y="13" rx="1"/><path d="M9.1 7.995a.905.905 0 111.8 0l-.35 3.507a.553.553 0 01-1.1 0L9.1 7.995z"/>');
var BIconAlertTriangleFill = /*#__PURE__*/makeIcon('AlertTriangleFill', '<path fill-rule="evenodd" d="M9.022 3.566a1.13 1.13 0 011.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H3.144c-.889 0-1.437-.99-.98-1.767L9.022 3.566zM9.002 14a1 1 0 112 0 1 1 0 01-2 0zM10 7a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 7z" clip-rule="evenodd"/>');
var BIconArchive = /*#__PURE__*/makeIcon('Archive', '<path fill-rule="evenodd" d="M4 7v7.5c0 .864.642 1.5 1.357 1.5h9.286c.715 0 1.357-.636 1.357-1.5V7h1v7.5c0 1.345-1.021 2.5-2.357 2.5H5.357C4.021 17 3 15.845 3 14.5V7h1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.5 9.5A.5.5 0 018 9h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zM17 4H3v2h14V4zM3 3a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3z" clip-rule="evenodd"/>');
var BIconArchiveFill = /*#__PURE__*/makeIcon('ArchiveFill', '<path fill-rule="evenodd" d="M14.643 17C15.979 17 17 15.845 17 14.5V7H3v7.5C3 15.845 4.021 17 5.357 17h9.286zM8 9a.5.5 0 000 1h4a.5.5 0 000-1H8zM3 3a1 1 0 00-1 1v1.5a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3z" clip-rule="evenodd"/>');
var BIconArrowBarBottom = /*#__PURE__*/makeIcon('ArrowBarBottom', '<path fill-rule="evenodd" d="M13.354 12.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 01.708-.708L10 14.793l2.646-2.647a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 8a.5.5 0 01.5.5V15a.5.5 0 01-1 0V8.5A.5.5 0 0110 8zM4 5.75a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowBarLeft = /*#__PURE__*/makeIcon('ArrowBarLeft', '<path fill-rule="evenodd" d="M7.854 6.646a.5.5 0 00-.708 0l-3 3a.5.5 0 000 .708l3 3a.5.5 0 00.708-.708L5.207 10l2.647-2.646a.5.5 0 000-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 10a.5.5 0 00-.5-.5H5a.5.5 0 000 1h6.5a.5.5 0 00.5-.5zm2.5 6a.5.5 0 01-.5-.5v-11a.5.5 0 011 0v11a.5.5 0 01-.5.5z" clip-rule="evenodd"/>');
var BIconArrowBarRight = /*#__PURE__*/makeIcon('ArrowBarRight', '<path fill-rule="evenodd" d="M12.146 6.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L14.793 10l-2.647-2.646a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 10a.5.5 0 01.5-.5H15a.5.5 0 010 1H8.5A.5.5 0 018 10zm-2.5 6a.5.5 0 01-.5-.5v-11a.5.5 0 011 0v11a.5.5 0 01-.5.5z" clip-rule="evenodd"/>');
var BIconArrowBarUp = /*#__PURE__*/makeIcon('ArrowBarUp', '<path fill-rule="evenodd" d="M13.354 7.854a.5.5 0 000-.708l-3-3a.5.5 0 00-.708 0l-3 3a.5.5 0 10.708.708L10 5.207l2.646 2.647a.5.5 0 00.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 12a.5.5 0 00.5-.5V5a.5.5 0 00-1 0v6.5a.5.5 0 00.5.5zm-6 2.75a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowClockwise = /*#__PURE__*/makeIcon('ArrowClockwise', '<path fill-rule="evenodd" d="M10 4.5a5.5 5.5 0 105.5 5.5.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63l-.5.865A5.472 5.472 0 0010 4.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10.646 1.646a.5.5 0 01.708 0l2.5 2.5a.5.5 0 010 .708l-2.5 2.5a.5.5 0 01-.708-.708L12.793 4.5l-2.147-2.146a.5.5 0 010-.708z" clip-rule="evenodd"/>');
var BIconArrowCounterclockwise = /*#__PURE__*/makeIcon('ArrowCounterclockwise', '<path fill-rule="evenodd" d="M10 4.5A5.5 5.5 0 114.5 10a.5.5 0 00-1 0 6.5 6.5 0 103.25-5.63l.5.865A5.472 5.472 0 0110 4.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.354 1.646a.5.5 0 00-.708 0l-2.5 2.5a.5.5 0 000 .708l2.5 2.5a.5.5 0 10.708-.708L7.207 4.5l2.147-2.146a.5.5 0 000-.708z" clip-rule="evenodd"/>');
var BIconArrowDown = /*#__PURE__*/makeIcon('ArrowDown', '<path fill-rule="evenodd" d="M6.646 11.646a.5.5 0 01.708 0L10 14.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 4.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V5a.5.5 0 01.5-.5z" clip-rule="evenodd"/>');
var BIconArrowDownLeft = /*#__PURE__*/makeIcon('ArrowDownLeft', '<path fill-rule="evenodd" d="M5 9.5a.5.5 0 01.5.5v4.5H10a.5.5 0 010 1H5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14.354 5.646a.5.5 0 010 .708l-9 9a.5.5 0 01-.708-.708l9-9a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconArrowDownRight = /*#__PURE__*/makeIcon('ArrowDownRight', '<path fill-rule="evenodd" d="M14 9.5a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H9a.5.5 0 010-1h4.5V10a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.646 5.646a.5.5 0 01.708 0l9 9a.5.5 0 01-.708.708l-9-9a.5.5 0 010-.708z" clip-rule="evenodd"/>');
var BIconArrowDownShort = /*#__PURE__*/makeIcon('ArrowDownShort', '<path fill-rule="evenodd" d="M6.646 9.646a.5.5 0 01.708 0L10 12.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 6.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V7a.5.5 0 01.5-.5z" clip-rule="evenodd"/>');
var BIconArrowLeft = /*#__PURE__*/makeIcon('ArrowLeft', '<path fill-rule="evenodd" d="M7.854 6.646a.5.5 0 010 .708L5.207 10l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.5 10a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowLeftRight = /*#__PURE__*/makeIcon('ArrowLeftRight', '<path fill-rule="evenodd" d="M12.146 9.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L14.793 13l-2.647-2.646a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4 13a.5.5 0 01.5-.5H15a.5.5 0 010 1H4.5A.5.5 0 014 13zm3.854-9.354a.5.5 0 010 .708L5.207 7l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.5 7a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowLeftShort = /*#__PURE__*/makeIcon('ArrowLeftShort', '<path fill-rule="evenodd" d="M9.854 6.646a.5.5 0 010 .708L7.207 10l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.5 10a.5.5 0 01.5-.5h6.5a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowRepeat = /*#__PURE__*/makeIcon('ArrowRepeat', '<path fill-rule="evenodd" d="M4 9.5a.5.5 0 00-.5.5 6.5 6.5 0 0012.13 3.25.5.5 0 00-.866-.5A5.5 5.5 0 014.5 10a.5.5 0 00-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.354 9.146a.5.5 0 00-.708 0l-2 2a.5.5 0 00.708.708L4 10.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zM15.947 10.5a.5.5 0 00.5-.5 6.5 6.5 0 00-12.13-3.25.5.5 0 10.866.5A5.5 5.5 0 0115.448 10a.5.5 0 00.5.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M18.354 8.146a.5.5 0 00-.708 0L16 9.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clip-rule="evenodd"/>');
var BIconArrowRight = /*#__PURE__*/makeIcon('ArrowRight', '<path fill-rule="evenodd" d="M12.146 6.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L14.793 10l-2.647-2.646a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4 10a.5.5 0 01.5-.5H15a.5.5 0 010 1H4.5A.5.5 0 014 10z" clip-rule="evenodd"/>');
var BIconArrowRightShort = /*#__PURE__*/makeIcon('ArrowRightShort', '<path fill-rule="evenodd" d="M10.146 6.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 10l-2.647-2.646a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6 10a.5.5 0 01.5-.5H13a.5.5 0 010 1H6.5A.5.5 0 016 10z" clip-rule="evenodd"/>');
var BIconArrowUp = /*#__PURE__*/makeIcon('ArrowUp', '<path fill-rule="evenodd" d="M10 5.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.646 4.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L10 5.707 7.354 8.354a.5.5 0 11-.708-.708l3-3z" clip-rule="evenodd"/>');
var BIconArrowUpDown = /*#__PURE__*/makeIcon('ArrowUpDown', '<path fill-rule="evenodd" d="M13 5.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.646 4.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L13 5.707l-2.646 2.647a.5.5 0 01-.708-.708l3-3zm-9 7a.5.5 0 01.708 0L7 14.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7 4.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V5a.5.5 0 01.5-.5z" clip-rule="evenodd"/>');
var BIconArrowUpLeft = /*#__PURE__*/makeIcon('ArrowUpLeft', '<path fill-rule="evenodd" d="M4.5 6a.5.5 0 01.5-.5h5a.5.5 0 010 1H5.5V11a.5.5 0 01-1 0V6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.646 5.646a.5.5 0 01.708 0l9 9a.5.5 0 01-.708.708l-9-9a.5.5 0 010-.708z" clip-rule="evenodd"/>');
var BIconArrowUpRight = /*#__PURE__*/makeIcon('ArrowUpRight', '<path fill-rule="evenodd" d="M8.5 6a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V6.5H9a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14.354 5.646a.5.5 0 010 .708l-9 9a.5.5 0 01-.708-.708l9-9a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconArrowUpShort = /*#__PURE__*/makeIcon('ArrowUpShort', '<path fill-rule="evenodd" d="M10 7.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V8a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.646 6.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L10 7.707l-2.646 2.647a.5.5 0 01-.708-.708l3-3z" clip-rule="evenodd"/>');
var BIconArrowsAngleContract = /*#__PURE__*/makeIcon('ArrowsAngleContract', '<path fill-rule="evenodd" d="M11.5 4.036a.5.5 0 01.5.5v3.5h3.5a.5.5 0 010 1h-4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M16.354 3.646a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l4.5-4.5a.5.5 0 01.708 0zm-7.5 7.5a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708l4.5-4.5a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.036 11.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V12h-3.5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowsAngleExpand = /*#__PURE__*/makeIcon('ArrowsAngleExpand', '<path fill-rule="evenodd" d="M4 11.5a.5.5 0 01.5.5v3.5H8a.5.5 0 010 1H4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.854 11.11a.5.5 0 010 .708l-4.5 4.5a.5.5 0 11-.708-.707l4.5-4.5a.5.5 0 01.708 0zm7.464-7.464a.5.5 0 010 .708l-4.5 4.5a.5.5 0 11-.707-.708l4.5-4.5a.5.5 0 01.707 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.5 4a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4.5H12a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconArrowsCollapse = /*#__PURE__*/makeIcon('ArrowsCollapse', '<path fill-rule="evenodd" d="M4 10a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11A.5.5 0 014 10zm6-7a.5.5 0 01.5.5V8a.5.5 0 01-1 0V3.5A.5.5 0 0110 3z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.354 5.646a.5.5 0 010 .708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 11.708-.708L10 7.293l1.646-1.647a.5.5 0 01.708 0zM10 17a.5.5 0 00.5-.5V12a.5.5 0 00-1 0v4.5a.5.5 0 00.5.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.354 14.354a.5.5 0 000-.708l-2-2a.5.5 0 00-.708 0l-2 2a.5.5 0 00.708.708L10 12.707l1.646 1.647a.5.5 0 00.708 0z" clip-rule="evenodd"/>');
var BIconArrowsExpand = /*#__PURE__*/makeIcon('ArrowsExpand', '<path fill-rule="evenodd" d="M4 10a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11A.5.5 0 014 10zm6-1.5a.5.5 0 00.5-.5V3.5a.5.5 0 00-1 0V8a.5.5 0 00.5.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.354 5.854a.5.5 0 000-.708l-2-2a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L10 4.207l1.646 1.647a.5.5 0 00.708 0zM10 11.5a.5.5 0 01.5.5v4.5a.5.5 0 01-1 0V12a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.354 14.146a.5.5 0 010 .708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L10 15.793l1.646-1.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconArrowsFullscreen = /*#__PURE__*/makeIcon('ArrowsFullscreen', '<path fill-rule="evenodd" d="M4 11.5a.5.5 0 01.5.5v3.5H8a.5.5 0 010 1H4a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.854 11.11a.5.5 0 010 .708l-4.5 4.5a.5.5 0 11-.708-.707l4.5-4.5a.5.5 0 01.708 0zm7.464-7.464a.5.5 0 010 .708l-4.5 4.5a.5.5 0 11-.707-.708l4.5-4.5a.5.5 0 01.707 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.5 4a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4.5H12a.5.5 0 01-.5-.5zm4.5 7.5a.5.5 0 00-.5.5v3.5H12a.5.5 0 000 1h4a.5.5 0 00.5-.5v-4a.5.5 0 00-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.146 11.11a.5.5 0 000 .708l4.5 4.5a.5.5 0 00.708-.707l-4.5-4.5a.5.5 0 00-.708 0zM3.682 3.646a.5.5 0 000 .708l4.5 4.5a.5.5 0 10.707-.708l-4.5-4.5a.5.5 0 00-.707 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.5 4a.5.5 0 00-.5-.5H4a.5.5 0 00-.5.5v4a.5.5 0 001 0V4.5H8a.5.5 0 00.5-.5z" clip-rule="evenodd"/>');
var BIconAt = /*#__PURE__*/makeIcon('At', '<path fill-rule="evenodd" d="M15.106 9.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V7.206h-1.032v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907s-.601 1.914-1.538 1.914c-.895 0-1.442-.725-1.442-1.914z" clip-rule="evenodd"/>');
var BIconAward = /*#__PURE__*/makeIcon('Award', '<path d="M10 2l1.669.864 1.858.282.842 1.68 1.337 1.32L15.4 8l.306 1.854-1.337 1.32-.842 1.68-1.858.282L10 14l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L4.6 8l-.306-1.854 1.337-1.32.842-1.68 1.858-.282L10 2z"/><path d="M6 13.794V18l4-1 4 1v-4.206l-2.018.306L10 15.126 8.018 14.1 6 13.794z"/>');
var BIconBackspace = /*#__PURE__*/makeIcon('Backspace', '<path fill-rule="evenodd" d="M8.603 4h7.08a1 1 0 011 1v10a1 1 0 01-1 1h-7.08a1 1 0 01-.76-.35L3 10l4.844-5.65A1 1 0 018.603 4zm7.08-1a2 2 0 012 2v10a2 2 0 01-2 2h-7.08a2 2 0 01-1.519-.698L2.241 10.65a1 1 0 010-1.302L7.084 3.7A2 2 0 018.603 3h7.08z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.83 7.146a.5.5 0 000 .708l5 5a.5.5 0 00.707-.708l-5-5a.5.5 0 00-.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13.537 7.146a.5.5 0 010 .708l-5 5a.5.5 0 01-.708-.708l5-5a.5.5 0 01.707 0z" clip-rule="evenodd"/>');
var BIconBackspaceFill = /*#__PURE__*/makeIcon('BackspaceFill', '<path fill-rule="evenodd" d="M17.683 5a2 2 0 00-2-2h-7.08a2 2 0 00-1.519.698L2.241 9.35a1 1 0 000 1.302l4.843 5.65A2 2 0 008.603 17h7.08a2 2 0 002-2V5zM7.829 7.854a.5.5 0 11.707-.708l2.147 2.147 2.146-2.147a.5.5 0 11.707.708L11.39 10l2.146 2.146a.5.5 0 01-.707.708l-2.146-2.147-2.147 2.147a.5.5 0 01-.707-.708L9.976 10 7.829 7.854z" clip-rule="evenodd"/>');
var BIconBackspaceReverse = /*#__PURE__*/makeIcon('BackspaceReverse', '<path fill-rule="evenodd" d="M11.08 4H4a1 1 0 00-1 1v10a1 1 0 001 1h7.08a1 1 0 00.76-.35L16.682 10l-4.844-5.65A1 1 0 0011.08 4zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h7.08a2 2 0 001.519-.698l4.843-5.651a1 1 0 000-1.302L12.6 3.7a2 2 0 00-1.52-.7H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.854 7.146a.5.5 0 010 .708l-5 5a.5.5 0 01-.708-.708l5-5a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.146 7.146a.5.5 0 000 .708l5 5a.5.5 0 00.708-.708l-5-5a.5.5 0 00-.708 0z" clip-rule="evenodd"/>');
var BIconBackspaceReverseFill = /*#__PURE__*/makeIcon('BackspaceReverseFill', '<path fill-rule="evenodd" d="M2 5a2 2 0 012-2h7.08a2 2 0 011.519.698l4.843 5.651a1 1 0 010 1.302L12.6 16.3a2 2 0 01-1.52.7H4a2 2 0 01-2-2V5zm9.854 2.854a.5.5 0 00-.708-.708L9 9.293 6.854 7.146a.5.5 0 10-.708.708L8.293 10l-2.147 2.146a.5.5 0 00.708.708L9 10.707l2.146 2.147a.5.5 0 00.708-.708L9.707 10l2.147-2.146z" clip-rule="evenodd"/>');
var BIconBarChart = /*#__PURE__*/makeIcon('BarChart', '<path fill-rule="evenodd" d="M6 13H4v3h2v-3zm5-4H9v7h2V9zm5-5h-2v12h2V4zm-2-1a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2zM8 9a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 01-1 1H9a1 1 0 01-1-1V9zm-5 4a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" clip-rule="evenodd"/>');
var BIconBarChartFill = /*#__PURE__*/makeIcon('BarChartFill', '<rect width="4" height="5" x="3" y="12" rx="1"/><rect width="4" height="9" x="8" y="8" rx="1"/><rect width="4" height="14" x="13" y="3" rx="1"/>');
var BIconBattery = /*#__PURE__*/makeIcon('Battery', '<path fill-rule="evenodd" d="M14 7H4a1 1 0 00-1 1v4a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1zM4 6a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path d="M16.5 11.5a1.5 1.5 0 000-3v3z"/>');
var BIconBatteryCharging = /*#__PURE__*/makeIcon('BatteryCharging', '<path d="M16.5 11.5a1.5 1.5 0 000-3v3z"/><path fill-rule="evenodd" d="M11.585 4.568a.5.5 0 01.226.579l-1.134 3.686h1.99a.5.5 0 01.364.843l-5.334 5.667a.5.5 0 01-.842-.49l1.135-3.686H6a.5.5 0 01-.364-.843l5.333-5.667a.5.5 0 01.616-.09z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.332 6H4a2 2 0 00-2 2v4a2 2 0 002 2h2.072l.307-1H4a1 1 0 01-1-1V8a1 1 0 011-1h3.391l.941-1zM6.45 8H4v4h1.313a1.5 1.5 0 01-.405-2.361L6.45 8zm.976 5l-.308 1H8.96l.21-.224h.001l.73-.776H8.53l-.085.09.028-.09H7.426zm1.354-1H7.733l.257-.833H6a.5.5 0 01-.364-.843l.793-.843L7.823 8h1.373l-2.039 2.167h1.51a.492.492 0 01.166.028.5.5 0 01.312.619L8.78 12zm.69 0h1.373l1.395-1.482.793-.842a.5.5 0 00-.364-.843h-1.99L10.933 8H9.887l-.166.54-.199.646a.5.5 0 00.478.647h1.51L9.47 12zm.725-5h1.046l.308-1H9.706l-.942 1h1.374l.085-.09-.028.09zm2.4-1l-.308 1H14a1 1 0 011 1v4a1 1 0 01-1 1h-2.724l-.942 1H14a2 2 0 002-2V8a2 2 0 00-2-2h-1.405zm-.378 6H14v-1.98a1.499 1.499 0 01-.241.341L12.217 12zM14 8.646V8h-.646a1.5 1.5 0 01.646.646z" clip-rule="evenodd"/>');
var BIconBatteryFull = /*#__PURE__*/makeIcon('BatteryFull', '<path fill-rule="evenodd" d="M14 7H4a1 1 0 00-1 1v4a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1zM4 6a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path d="M4 8h10v4H4V8zm12.5 3.5a1.5 1.5 0 000-3v3z"/>');
var BIconBell = /*#__PURE__*/makeIcon('Bell', '<path d="M10 18a2 2 0 002-2H8a2 2 0 002 2z"/><path fill-rule="evenodd" d="M10 3.918l-.797.161A4.002 4.002 0 006 8c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C14.134 10.197 14 8.628 14 8a4.002 4.002 0 00-3.203-3.92L10 3.917zM16.22 14c.223.447.482.801.78 1H3c.299-.199.557-.553.78-1C4.68 12.2 5 8.88 5 8c0-2.42 1.72-4.44 4.005-4.901a1 1 0 111.99 0A5.002 5.002 0 0115 8c0 .88.32 4.2 1.22 6z" clip-rule="evenodd"/>');
var BIconBellFill = /*#__PURE__*/makeIcon('BellFill', '<path d="M10 18a2 2 0 002-2H8a2 2 0 002 2zm.995-14.901a1 1 0 10-1.99 0A5.002 5.002 0 005 8c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>');
var BIconBlockquoteLeft = /*#__PURE__*/makeIcon('BlockquoteLeft', '<path fill-rule="evenodd" d="M4 5.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm5 3a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm-5 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path d="M5.734 8.352a6.586 6.586 0 00-.445.275 1.94 1.94 0 00-.346.299 1.38 1.38 0 00-.252.369c-.058.129-.1.295-.123.498h.282c.242 0 .431.06.568.182.14.117.21.29.21.521a.697.697 0 01-.187.463c-.12.14-.289.21-.503.21-.336 0-.577-.109-.721-.327-.145-.223-.217-.514-.217-.873 0-.254.055-.485.164-.692.11-.21.242-.398.399-.562.16-.168.33-.31.51-.428.179-.117.33-.213.45-.287l.211.352zm2.168 0a6.588 6.588 0 00-.445.275 1.94 1.94 0 00-.346.299c-.113.12-.199.246-.257.375a1.75 1.75 0 00-.118.492h.282c.242 0 .431.06.568.182.14.117.21.29.21.521a.697.697 0 01-.187.463c-.12.14-.289.21-.504.21-.335 0-.576-.109-.72-.327-.145-.223-.217-.514-.217-.873 0-.254.055-.485.164-.692.11-.21.242-.398.398-.562.16-.168.33-.31.51-.428.18-.117.33-.213.451-.287l.211.352z"/>');
var BIconBlockquoteRight = /*#__PURE__*/makeIcon('BlockquoteRight', '<path fill-rule="evenodd" d="M4 5.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path d="M14.168 8.352c.184.105.332.197.445.275.114.074.229.174.346.299.11.117.193.24.252.369s.1.295.123.498h-.281c-.243 0-.432.06-.569.182-.14.117-.21.29-.21.521 0 .164.062.319.187.463.121.14.289.21.504.21.336 0 .576-.109.72-.327.145-.223.217-.514.217-.873 0-.254-.054-.485-.164-.692a2.436 2.436 0 00-.398-.562c-.16-.168-.33-.31-.51-.428-.18-.117-.33-.213-.451-.287l-.211.352zm-2.168 0c.184.105.332.197.445.275.114.074.229.174.346.299.113.12.2.246.258.375.055.125.094.289.117.492h-.281c-.242 0-.432.06-.569.182-.14.117-.21.29-.21.521 0 .164.062.319.187.463.121.14.289.21.504.21.336 0 .576-.109.72-.327.145-.223.217-.514.217-.873 0-.254-.054-.485-.164-.692a2.438 2.438 0 00-.398-.562c-.16-.168-.33-.31-.51-.428-.18-.117-.33-.213-.451-.287L12 8.352z"/>');
var BIconBook = /*#__PURE__*/makeIcon('Book', '<path fill-rule="evenodd" d="M5.214 3.072c1.599-.32 3.702-.363 5.14 1.074a.5.5 0 01.146.354v11a.5.5 0 01-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 012 15.5v-11a.5.5 0 01.276-.447L2.5 4.5l-.224-.447.002-.001.004-.002.013-.006a5.116 5.116 0 01.22-.103 12.958 12.958 0 012.7-.869zM3 4.82v9.908c.846-.343 1.944-.672 3.074-.788 1.143-.118 2.387-.023 3.426.56V4.718c-1.063-.929-2.631-.956-4.09-.664A11.958 11.958 0 003 4.82z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14.786 3.072c-1.598-.32-3.702-.363-5.14 1.074A.5.5 0 009.5 4.5v11a.5.5 0 00.854.354c.844-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0018 15.5v-11a.5.5 0 00-.276-.447L17.5 4.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 00-.799-.34 12.96 12.96 0 00-2.073-.609zM17 4.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.386-.023-3.426.56V4.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0117 4.82z" clip-rule="evenodd"/>');
var BIconBookHalfFill = /*#__PURE__*/makeIcon('BookHalfFill', '<path fill-rule="evenodd" d="M5.214 3.072c1.599-.32 3.702-.363 5.14 1.074a.5.5 0 01.146.354v11a.5.5 0 01-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 012 15.5v-11a.5.5 0 01.276-.447L2.5 4.5l-.224-.447.002-.001.004-.002.013-.006a5.116 5.116 0 01.22-.103 12.958 12.958 0 012.7-.869zM3 4.82v9.908c.846-.343 1.944-.672 3.074-.788 1.143-.118 2.387-.023 3.426.56V4.718c-1.063-.929-2.631-.956-4.09-.664A11.958 11.958 0 003 4.82z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14.786 3.072c-1.598-.32-3.702-.363-5.14 1.074A.5.5 0 009.5 4.5v11a.5.5 0 00.854.354c.844-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0018 15.5v-11a.5.5 0 00-.276-.447L17.5 4.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 00-.799-.34 12.96 12.96 0 00-2.073-.609z" clip-rule="evenodd"/>');
var BIconBookmark = /*#__PURE__*/makeIcon('Bookmark', '<path fill-rule="evenodd" d="M10 14l5 3V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12l5-3zm-4 1.234l4-2.4 4 2.4V5a1 1 0 00-1-1H7a1 1 0 00-1 1v10.234z" clip-rule="evenodd"/>');
var BIconBookmarkFill = /*#__PURE__*/makeIcon('BookmarkFill', '<path fill-rule="evenodd" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12l-5-3-5 3V5z" clip-rule="evenodd"/>');
var BIconBootstrap = /*#__PURE__*/makeIcon('Bootstrap', '<path fill-rule="evenodd" d="M14 3H6a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V6a3 3 0 00-3-3zM6 2a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V6a4 4 0 00-4-4H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10.537 14H7.062V5.545h3.398c1.588 0 2.543.809 2.543 2.11 0 .884-.65 1.675-1.482 1.816v.1c1.143.117 1.904.931 1.904 2.033 0 1.488-1.084 2.396-2.888 2.396zM8.375 6.658v2.467h1.558c1.16 0 1.764-.428 1.764-1.23 0-.78-.568-1.237-1.541-1.237H8.375zm1.898 6.229H8.375v-2.725h1.822c1.236 0 1.887.463 1.887 1.348 0 .896-.627 1.377-1.811 1.377z" clip-rule="evenodd"/>');
var BIconBootstrapFill = /*#__PURE__*/makeIcon('BootstrapFill', '<path fill-rule="evenodd" d="M6.002 2a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V6a4 4 0 00-4-4h-8zm1.06 12h3.475c1.804 0 2.888-.908 2.888-2.396 0-1.102-.761-1.916-1.904-2.034v-.1c.832-.14 1.482-.93 1.482-1.816 0-1.3-.955-2.11-2.543-2.11H7.063V14zm1.313-4.875V6.658h1.78c.974 0 1.542.457 1.542 1.237 0 .802-.604 1.23-1.764 1.23H8.375zm0 3.762h1.898c1.184 0 1.81-.48 1.81-1.377 0-.885-.65-1.348-1.886-1.348H8.375v2.725z" clip-rule="evenodd"/>');
var BIconBootstrapReboot = /*#__PURE__*/makeIcon('BootstrapReboot', '<path fill-rule="evenodd" d="M3.161 10a6.84 6.84 0 106.842-6.84.58.58 0 110-1.16 8 8 0 11-6.556 3.412l-.663-.577a.58.58 0 01.227-.997l2.52-.69a.58.58 0 01.728.633l-.332 2.592a.58.58 0 01-.956.364l-.643-.56A6.812 6.812 0 003.16 10zm5.228-.079V7.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.505 1.324-1.386 1.324h-1.6zm0 3.75v-2.828h1.57l1.498 2.828h1.314l-1.646-3.006c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H7.248v7.352h1.141z" clip-rule="evenodd"/>');
var BIconBoxArrowBottomLeft = /*#__PURE__*/makeIcon('BoxArrowBottomLeft', '<path fill-rule="evenodd" d="M15 3.5A1.5 1.5 0 0116.5 5v8a1.5 1.5 0 01-1.5 1.5h-4a.5.5 0 010-1h4a.5.5 0 00.5-.5V5a.5.5 0 00-.5-.5H7a.5.5 0 00-.5.5v4a.5.5 0 01-1 0V5A1.5 1.5 0 017 3.5h8zm-11 7a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 000-1H4.5V11a.5.5 0 00-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3.646 16.354a.5.5 0 00.708 0l8-8a.5.5 0 00-.708-.708l-8 8a.5.5 0 000 .708z" clip-rule="evenodd"/>');
var BIconBoxArrowBottomRight = /*#__PURE__*/makeIcon('BoxArrowBottomRight', '<path fill-rule="evenodd" d="M5 3.5A1.5 1.5 0 003.5 5v8A1.5 1.5 0 005 14.5h4a.5.5 0 000-1H5a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v4a.5.5 0 001 0V5A1.5 1.5 0 0013 3.5H5zm11 7a.5.5 0 01.5.5v5a.5.5 0 01-.5.5h-5a.5.5 0 010-1h4.5V11a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M16.354 16.354a.5.5 0 01-.708 0l-8-8a.5.5 0 11.708-.708l8 8a.5.5 0 010 .708z" clip-rule="evenodd"/>');
var BIconBoxArrowDown = /*#__PURE__*/makeIcon('BoxArrowDown', '<path fill-rule="evenodd" d="M6.646 13.646a.5.5 0 01.708 0L10 16.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 6.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V7a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.5 4A1.5 1.5 0 016 2.5h8A1.5 1.5 0 0115.5 4v7a1.5 1.5 0 01-1.5 1.5h-1.5a.5.5 0 010-1H14a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5H6a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h1.5a.5.5 0 010 1H6A1.5 1.5 0 014.5 11V4z" clip-rule="evenodd"/>');
var BIconBoxArrowLeft = /*#__PURE__*/makeIcon('BoxArrowLeft', '<path fill-rule="evenodd" d="M6.354 13.354a.5.5 0 000-.708L3.707 10l2.647-2.646a.5.5 0 10-.708-.708l-3 3a.5.5 0 000 .708l3 3a.5.5 0 00.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13.5 10a.5.5 0 00-.5-.5H4a.5.5 0 000 1h9a.5.5 0 00.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M16 15.5a1.5 1.5 0 001.5-1.5V6A1.5 1.5 0 0016 4.5H9A1.5 1.5 0 007.5 6v1.5a.5.5 0 001 0V6a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v8a.5.5 0 01-.5.5H9a.5.5 0 01-.5-.5v-1.5a.5.5 0 00-1 0V14A1.5 1.5 0 009 15.5h7z" clip-rule="evenodd"/>');
var BIconBoxArrowRight = /*#__PURE__*/makeIcon('BoxArrowRight', '<path fill-rule="evenodd" d="M13.646 13.354a.5.5 0 010-.708L16.293 10l-2.647-2.646a.5.5 0 01.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.5 10a.5.5 0 01.5-.5h9a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4 15.5A1.5 1.5 0 012.5 14V6A1.5 1.5 0 014 4.5h7A1.5 1.5 0 0112.5 6v1.5a.5.5 0 01-1 0V6a.5.5 0 00-.5-.5H4a.5.5 0 00-.5.5v8a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-1.5a.5.5 0 011 0V14a1.5 1.5 0 01-1.5 1.5H4z" clip-rule="evenodd"/>');
var BIconBoxArrowUp = /*#__PURE__*/makeIcon('BoxArrowUp', '<path fill-rule="evenodd" d="M6.646 6.354a.5.5 0 00.708 0L10 3.707l2.646 2.647a.5.5 0 00.708-.708l-3-3a.5.5 0 00-.708 0l-3 3a.5.5 0 000 .708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 13.5a.5.5 0 00.5-.5V4a.5.5 0 00-1 0v9a.5.5 0 00.5.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.5 16A1.5 1.5 0 006 17.5h8a1.5 1.5 0 001.5-1.5V9A1.5 1.5 0 0014 7.5h-1.5a.5.5 0 000 1H14a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5V9a.5.5 0 01.5-.5h1.5a.5.5 0 000-1H6A1.5 1.5 0 004.5 9v7z" clip-rule="evenodd"/>');
var BIconBoxArrowUpLeft = /*#__PURE__*/makeIcon('BoxArrowUpLeft', '<path fill-rule="evenodd" d="M16.5 15a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 15v-4a.5.5 0 011 0v4a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V7a.5.5 0 00-.5-.5h-4a.5.5 0 010-1h4A1.5 1.5 0 0116.5 7v8zm-7-11a.5.5 0 00-.5-.5H4a.5.5 0 00-.5.5v5a.5.5 0 001 0V4.5H9a.5.5 0 00.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3.646 3.646a.5.5 0 000 .708l8 8a.5.5 0 00.708-.708l-8-8a.5.5 0 00-.708 0z" clip-rule="evenodd"/>');
var BIconBoxArrowUpRight = /*#__PURE__*/makeIcon('BoxArrowUpRight', '<path fill-rule="evenodd" d="M3.5 15A1.5 1.5 0 005 16.5h8a1.5 1.5 0 001.5-1.5v-4a.5.5 0 00-1 0v4a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5h4a.5.5 0 000-1H5A1.5 1.5 0 003.5 7v8zm7-11a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V4.5H11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M16.354 3.646a.5.5 0 010 .708l-8 8a.5.5 0 01-.708-.708l8-8a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconBraces = /*#__PURE__*/makeIcon('Braces', '<path d="M4.114 10.063V9.9c1.005-.102 1.497-.615 1.497-1.6V6.503c0-1.094.39-1.538 1.354-1.538h.273V4h-.376C5.25 4 4.49 4.759 4.49 6.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538v-1.798c0-.984-.492-1.497-1.497-1.6zM15.886 9.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V9.332c-1.114 0-1.49-.362-1.49-1.456V6.352C15.51 4.759 14.75 4 13.138 4h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V8.3c0 .984.492 1.497 1.497 1.6z"/>');
var BIconBrightnessFillHigh = /*#__PURE__*/makeIcon('BrightnessFillHigh', '<circle cx="10" cy="10" r="4"/><path fill-rule="evenodd" d="M10 2a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 0110 2zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM5 10a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zm10.657-5.657a.5.5 0 010 .707l-1.414 1.414a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L5.05 15.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM6.464 6.464a.5.5 0 01-.707 0L4.343 5.05a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707z" clip-rule="evenodd"/>');
var BIconBrightnessFillLow = /*#__PURE__*/makeIcon('BrightnessFillLow', '<circle cx="10" cy="10" r="4"/><circle cx="10" cy="4.5" r=".5"/><circle cx="10" cy="15.5" r=".5"/><circle cx="15.5" cy="10" r=".5" transform="rotate(90 15.5 10)"/><circle cx="4.5" cy="10" r=".5" transform="rotate(90 4.5 10)"/><circle cx="13.889" cy="6.111" r=".5" transform="rotate(45 13.89 6.11)"/><circle cx="6.111" cy="13.889" r=".5" transform="rotate(45 6.11 13.89)"/><circle cx="13.889" cy="13.889" r=".5" transform="rotate(135 13.89 13.89)"/><circle cx="6.111" cy="6.111" r=".5" transform="rotate(135 6.11 6.11)"/>');
var BIconBrightnessHigh = /*#__PURE__*/makeIcon('BrightnessHigh', '<path fill-rule="evenodd" d="M10 13a3 3 0 100-6 3 3 0 000 6zm0 1a4 4 0 100-8 4 4 0 000 8zm0-12a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 0110 2zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM5 10a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zm10.657-5.657a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L5.05 15.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM6.464 6.464a.5.5 0 01-.707 0L4.343 5.05a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707z" clip-rule="evenodd"/>');
var BIconBrightnessLow = /*#__PURE__*/makeIcon('BrightnessLow', '<path fill-rule="evenodd" d="M10 13a3 3 0 100-6 3 3 0 000 6zm0 1a4 4 0 100-8 4 4 0 000 8z" clip-rule="evenodd"/><circle cx="10" cy="4.5" r=".5"/><circle cx="10" cy="15.5" r=".5"/><circle cx="15.5" cy="10" r=".5" transform="rotate(90 15.5 10)"/><circle cx="4.5" cy="10" r=".5" transform="rotate(90 4.5 10)"/><circle cx="13.889" cy="6.111" r=".5" transform="rotate(45 13.89 6.11)"/><circle cx="6.111" cy="13.889" r=".5" transform="rotate(45 6.11 13.89)"/><circle cx="13.889" cy="13.889" r=".5" transform="rotate(135 13.89 13.89)"/><circle cx="6.111" cy="6.111" r=".5" transform="rotate(135 6.11 6.11)"/>');
var BIconBrush = /*#__PURE__*/makeIcon('Brush', '<path d="M17.213 3.018a.572.572 0 01.755.05.57.57 0 01.058.746c-.941 1.268-3.982 5.293-6.426 7.736a12.89 12.89 0 01-1.952 1.596c-.508.339-1.167.234-1.599-.197-.416-.416-.53-1.047-.213-1.543.347-.542.888-1.273 1.643-1.977 2.521-2.35 6.476-5.44 7.734-6.411z"/><path d="M9 14a2 2 0 01-2 2c-1 0-2 0-3.5-.5s.5-1 1-1.5 1.395-2 2.5-2a2 2 0 012 2z"/>');
var BIconBucket = /*#__PURE__*/makeIcon('Bucket', '<path fill-rule="evenodd" d="M10 3.5A4.5 4.5 0 005.5 8h-1a5.5 5.5 0 1111 0h-1A4.5 4.5 0 0010 3.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3.61 7.687A.5.5 0 014 7.5h12a.5.5 0 01.488.608l-1.826 8.217a1.5 1.5 0 01-1.464 1.175H6.802a1.5 1.5 0 01-1.464-1.175L3.512 8.108a.5.5 0 01.098-.42zm1.013.813l1.691 7.608a.5.5 0 00.488.392h6.396a.5.5 0 00.488-.392l1.69-7.608H4.624z" clip-rule="evenodd"/>');
var BIconBucketFill = /*#__PURE__*/makeIcon('BucketFill', '<path fill-rule="evenodd" d="M10 3.5A4.5 4.5 0 005.5 8h-1a5.5 5.5 0 1111 0h-1A4.5 4.5 0 0010 3.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3.61 7.687A.5.5 0 014 7.5h12a.5.5 0 01.488.608l-1.826 8.217a1.5 1.5 0 01-1.464 1.175H6.802a1.5 1.5 0 01-1.464-1.175L3.512 8.108a.5.5 0 01.098-.42z" clip-rule="evenodd"/>');
var BIconBuilding = /*#__PURE__*/makeIcon('Building', '<path fill-rule="evenodd" d="M17.285 2.089a.5.5 0 01.215.411v15a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V16h-1v1.5a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-6a.5.5 0 01.418-.493l5.582-.93V5.5a.5.5 0 01.324-.468l8-3a.5.5 0 01.46.057zM9.5 5.846V10.5a.5.5 0 01-.418.493l-5.582.93V17h8v-1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V17h2V3.221l-7 2.625z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.5 17.5v-7h1v7h-1z" clip-rule="evenodd"/><path d="M4.5 13h1v1h-1v-1zm2 0h1v1h-1v-1zm-2 2h1v1h-1v-1zm2 0h1v1h-1v-1zm6-10h1v1h-1V5zm2 0h1v1h-1V5zm-4 2h1v1h-1V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zm-2 2h1v1h-1V9zm2 0h1v1h-1V9zm-4 0h1v1h-1V9zm0 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 2h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1z"/>');
var BIconBullseye = /*#__PURE__*/makeIcon('Bullseye', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 15a5 5 0 100-10 5 5 0 000 10zm0 1a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 13a3 3 0 100-6 3 3 0 000 6zm0 1a4 4 0 100-8 4 4 0 000 8z" clip-rule="evenodd"/><path d="M11.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>');
var BIconCalendar = /*#__PURE__*/makeIcon('Calendar', '<path fill-rule="evenodd" d="M16 2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM3 5.857C3 5.384 3.448 5 4 5h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H4c-.552 0-1-.384-1-.857V5.857z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.5 9a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>');
var BIconCalendarFill = /*#__PURE__*/makeIcon('CalendarFill', '<path d="M2 4a2 2 0 012-2h12a2 2 0 012 2H2z"/><path fill-rule="evenodd" d="M2 5h16v11a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm6.5 4a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm-8 2a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd"/>');
var BIconCamera = /*#__PURE__*/makeIcon('Camera', '<path d="M11 7c-1.657 0-4 1.343-4 3a4 4 0 014-4v1z"/><path fill-rule="evenodd" d="M16.333 5h-2.015A5.97 5.97 0 0011 4a5.972 5.972 0 00-3.318 1H3.667C2.747 5 2 5.746 2 6.667v6.666C2 14.253 2.746 15 3.667 15h4.015c.95.632 2.091 1 3.318 1a5.973 5.973 0 003.318-1h2.015c.92 0 1.667-.746 1.667-1.667V6.667C18 5.747 17.254 5 16.333 5zM3.5 7a.5.5 0 100-1 .5.5 0 000 1zm7.5 8a5 5 0 100-10 5 5 0 000 10z" clip-rule="evenodd"/><path d="M4 5a1 1 0 011-1h1a1 1 0 010 2H5a1 1 0 01-1-1z"/>');
var BIconCameraVideo = /*#__PURE__*/makeIcon('CameraVideo', '<path fill-rule="evenodd" d="M4.667 5.5c-.645 0-1.167.522-1.167 1.167v6.666c0 .645.522 1.167 1.167 1.167h6.666c.645 0 1.167-.522 1.167-1.167V6.667c0-.645-.522-1.167-1.167-1.167H4.667zM2.5 6.667C2.5 5.47 3.47 4.5 4.667 4.5h6.666c1.197 0 2.167.97 2.167 2.167v6.666c0 1.197-.97 2.167-2.167 2.167H4.667A2.167 2.167 0 012.5 13.333V6.667z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13.25 7.65l2.768-1.605a.318.318 0 01.482.263v7.384c0 .228-.26.393-.482.264l-2.767-1.605-.502.865 2.767 1.605c.859.498 1.984-.095 1.984-1.129V6.308c0-1.033-1.125-1.626-1.984-1.128L12.75 6.785l.502.865z" clip-rule="evenodd"/>');
var BIconCameraVideoFill = /*#__PURE__*/makeIcon('CameraVideoFill', '<path d="M4.667 5h6.666C12.253 5 13 5.746 13 6.667v6.666c0 .92-.746 1.667-1.667 1.667H4.667C3.747 15 3 14.254 3 13.333V6.667C3 5.747 3.746 5 4.667 5z"/><path d="M9.404 10.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V6.308c0-.63-.692-1.01-1.233-.696L9.404 9.304a.802.802 0 000 1.393z"/>');
var BIconCapslock = /*#__PURE__*/makeIcon('Capslock', '<path fill-rule="evenodd" d="M9.27 3.047a1 1 0 011.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H13.5v1a1 1 0 01-1 1h-5a1 1 0 01-1-1v-1H3.654c-.875 0-1.328-1.045-.73-1.684L9.27 3.047zm7.076 7.453L10 3.731 3.654 10.5H6.5a1 1 0 011 1v1h5v-1a1 1 0 011-1h2.846zm-9.846 5a1 1 0 011-1h5a1 1 0 011 1v1a1 1 0 01-1 1h-5a1 1 0 01-1-1v-1zm6 0h-5v1h5v-1z" clip-rule="evenodd"/>');
var BIconCapslockFill = /*#__PURE__*/makeIcon('CapslockFill', '<path fill-rule="evenodd" d="M9.27 3.047a1 1 0 011.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H13.5v1a1 1 0 01-1 1h-5a1 1 0 01-1-1v-1H3.654c-.875 0-1.328-1.045-.73-1.684L9.27 3.047zM6.5 15.5a1 1 0 011-1h5a1 1 0 011 1v1a1 1 0 01-1 1h-5a1 1 0 01-1-1v-1z" clip-rule="evenodd"/>');
var BIconChat = /*#__PURE__*/makeIcon('Chat', '<path fill-rule="evenodd" d="M8.207 13.293L7.5 14a5.5 5.5 0 110-11h5a5.5 5.5 0 110 11s-1.807 2.169-4.193 2.818C7.887 16.933 7.449 17 7 17c.291-.389.488-.74.617-1.052C8.149 14.649 7.5 14 7.5 14c.707-.707.708-.707.708-.706h.001l.002.003.004.004.01.01a1.184 1.184 0 01.074.084c.039.047.085.108.134.183.097.15.206.36.284.626.114.386.154.855.047 1.394.717-.313 1.37-.765 1.895-1.201a10.266 10.266 0 001.013-.969l.05-.056.01-.012m0 0A1 1 0 0112.5 13a4.5 4.5 0 100-9h-5a4.5 4.5 0 000 9 1 1 0 01.707.293" clip-rule="evenodd"/>');
var BIconChatFill = /*#__PURE__*/makeIcon('ChatFill', '<path fill-rule="evenodd" d="M7.5 14s.65.65.117 1.948A4.821 4.821 0 017 17c.449 0 .887-.067 1.307-.181C10.692 16.169 12.5 14 12.5 14a5.5 5.5 0 100-11h-5a5.5 5.5 0 100 11z" clip-rule="evenodd"/>');
var BIconCheck = /*#__PURE__*/makeIcon('Check', '<path fill-rule="evenodd" d="M15.854 5.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L8.5 12.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconCheckBox = /*#__PURE__*/makeIcon('CheckBox', '<path fill-rule="evenodd" d="M17.354 4.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L10 11.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3.5 15A1.5 1.5 0 005 16.5h10a1.5 1.5 0 001.5-1.5v-5a.5.5 0 00-1 0v5a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5h8a.5.5 0 000-1H5A1.5 1.5 0 003.5 5v10z" clip-rule="evenodd"/>');
var BIconCheckCircle = /*#__PURE__*/makeIcon('CheckCircle', '<path fill-rule="evenodd" d="M17.354 4.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L10 11.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 4.5a5.5 5.5 0 105.5 5.5.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 0010 4.5z" clip-rule="evenodd"/>');
var BIconChevronCompactDown = /*#__PURE__*/makeIcon('ChevronCompactDown', '<path fill-rule="evenodd" d="M3.553 8.776a.5.5 0 01.67-.223L10 11.44l5.776-2.888a.5.5 0 11.448.894l-6 3a.5.5 0 01-.448 0l-6-3a.5.5 0 01-.223-.67z" clip-rule="evenodd"/>');
var BIconChevronCompactLeft = /*#__PURE__*/makeIcon('ChevronCompactLeft', '<path fill-rule="evenodd" d="M11.224 3.553a.5.5 0 01.223.67L8.56 10l2.888 5.776a.5.5 0 11-.894.448l-3-6a.5.5 0 010-.448l3-6a.5.5 0 01.67-.223z" clip-rule="evenodd"/>');
var BIconChevronCompactRight = /*#__PURE__*/makeIcon('ChevronCompactRight', '<path fill-rule="evenodd" d="M8.776 3.553a.5.5 0 01.671.223l3 6a.5.5 0 010 .448l-3 6a.5.5 0 11-.894-.448L11.44 10 8.553 4.224a.5.5 0 01.223-.671z" clip-rule="evenodd"/>');
var BIconChevronCompactUp = /*#__PURE__*/makeIcon('ChevronCompactUp', '<path fill-rule="evenodd" d="M9.776 7.553a.5.5 0 01.448 0l6 3a.5.5 0 11-.448.894L10 8.56l-5.776 2.888a.5.5 0 11-.448-.894l6-3z" clip-rule="evenodd"/>');
var BIconChevronDown = /*#__PURE__*/makeIcon('ChevronDown', '<path fill-rule="evenodd" d="M3.646 6.646a.5.5 0 01.708 0L10 12.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"/>');
var BIconChevronLeft = /*#__PURE__*/makeIcon('ChevronLeft', '<path fill-rule="evenodd" d="M13.354 3.646a.5.5 0 010 .708L7.707 10l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconChevronRight = /*#__PURE__*/makeIcon('ChevronRight', '<path fill-rule="evenodd" d="M6.646 3.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L12.293 10 6.646 4.354a.5.5 0 010-.708z" clip-rule="evenodd"/>');
var BIconChevronUp = /*#__PURE__*/makeIcon('ChevronUp', '<path fill-rule="evenodd" d="M9.646 6.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L10 7.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z" clip-rule="evenodd"/>');
var BIconCircle = /*#__PURE__*/makeIcon('Circle', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/>');
var BIconCircleFill = /*#__PURE__*/makeIcon('CircleFill', '<circle cx="10" cy="10" r="8"/>');
var BIconCircleHalf = /*#__PURE__*/makeIcon('CircleHalf', '<path fill-rule="evenodd" d="M10 17V3a7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/>');
var BIconCircleSlash = /*#__PURE__*/makeIcon('CircleSlash', '<path fill-rule="evenodd" d="M10 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM5.071 4.347a7.5 7.5 0 0110.582 10.582L5.071 4.347zm-.724.724a7.5 7.5 0 0010.582 10.582L4.347 5.071z" clip-rule="evenodd"/>');
var BIconClock = /*#__PURE__*/makeIcon('Clock', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm8-7a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 4a.5.5 0 01.5.5V10a.5.5 0 01-.5.5H5.5a.5.5 0 010-1h4v-5A.5.5 0 0110 4z" clip-rule="evenodd"/>');
var BIconClockFill = /*#__PURE__*/makeIcon('ClockFill', '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM5.5 9.5h4v-5a.5.5 0 011 0V10a.5.5 0 01-.5.5H5.5a.5.5 0 010-1z" clip-rule="evenodd"/>');
var BIconCloud = /*#__PURE__*/makeIcon('Cloud', '<path fill-rule="evenodd" d="M6.887 9.2l-.964-.165A2.5 2.5 0 105.5 14h10a1.5 1.5 0 00.237-2.982l-1.038-.164.216-1.028a4 4 0 10-7.843-1.587l-.185.96zm9.084.341a5 5 0 00-9.88-1.492A3.5 3.5 0 105.5 15h9.999a2.5 2.5 0 00.394-4.968c.033-.16.06-.324.077-.49z" clip-rule="evenodd"/>');
var BIconCloudDownload = /*#__PURE__*/makeIcon('CloudDownload', '<path d="M6.887 7.2l-.964-.165A2.5 2.5 0 105.5 12H8v1H5.5a3.5 3.5 0 11.59-6.95 5.002 5.002 0 119.804 1.98A2.501 2.501 0 0115.5 13H12v-1h3.5a1.5 1.5 0 00.237-2.981L14.7 8.854l.216-1.028a4 4 0 10-7.843-1.587l-.185.96z"/><path fill-rule="evenodd" d="M7 14.5a.5.5 0 01.707 0L10 16.793l2.293-2.293a.5.5 0 11.707.707l-2.646 2.647a.5.5 0 01-.708 0L7 15.207a.5.5 0 010-.707z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 8a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 0110 8z" clip-rule="evenodd"/>');
var BIconCloudFill = /*#__PURE__*/makeIcon('CloudFill', '<path fill-rule="evenodd" d="M5.5 15a3.5 3.5 0 11.59-6.95 5.002 5.002 0 119.804 1.98A2.5 2.5 0 0115.5 15h-10z" clip-rule="evenodd"/>');
var BIconCloudUpload = /*#__PURE__*/makeIcon('CloudUpload', '<path d="M6.887 8.2l-.964-.165A2.5 2.5 0 105.5 13H8v1H5.5a3.5 3.5 0 11.59-6.95 5.002 5.002 0 119.804 1.98A2.501 2.501 0 0115.5 14H12v-1h3.5a1.5 1.5 0 00.237-2.982L14.7 9.854l.216-1.028a4 4 0 10-7.843-1.587l-.185.96z"/><path fill-rule="evenodd" d="M7 10.854a.5.5 0 00.707 0L10 8.56l2.293 2.293a.5.5 0 00.707-.707L10.354 7.5a.5.5 0 00-.708 0L7 10.146a.5.5 0 000 .708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 8a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 0110 8z" clip-rule="evenodd"/>');
var BIconCode = /*#__PURE__*/makeIcon('Code', '<path fill-rule="evenodd" d="M7.854 6.146a.5.5 0 010 .708L4.707 10l3.147 3.146a.5.5 0 01-.708.708l-3.5-3.5a.5.5 0 010-.708l3.5-3.5a.5.5 0 01.708 0zm4.292 0a.5.5 0 000 .708L15.293 10l-3.147 3.146a.5.5 0 00.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 00-.708 0z" clip-rule="evenodd"/>');
var BIconCodeSlash = /*#__PURE__*/makeIcon('CodeSlash', '<path fill-rule="evenodd" d="M6.854 6.146a.5.5 0 010 .708L3.707 10l3.147 3.146a.5.5 0 01-.708.708l-3.5-3.5a.5.5 0 010-.708l3.5-3.5a.5.5 0 01.708 0zm6.292 0a.5.5 0 000 .708L16.293 10l-3.147 3.146a.5.5 0 00.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 00-.708 0zm-.999-3.124a.5.5 0 01.33.625l-4 13a.5.5 0 11-.955-.294l4-13a.5.5 0 01.625-.33z" clip-rule="evenodd"/>');
var BIconColumns = /*#__PURE__*/makeIcon('Columns', '<path fill-rule="evenodd" d="M17 4H3v12h14V4zM3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.5 16V4h1v12h-1zm0-8H3V7h6.5v1zm7.5 5h-6.5v-1H17v1z" clip-rule="evenodd"/>');
var BIconColumnsGutters = /*#__PURE__*/makeIcon('ColumnsGutters', '<path fill-rule="evenodd" d="M8 3H3v3h5V3zM3 2a1 1 0 00-1 1v3a1 1 0 001 1h5a1 1 0 001-1V3a1 1 0 00-1-1H3zm14 12h-5v3h5v-3zm-5-1a1 1 0 00-1 1v3a1 1 0 001 1h5a1 1 0 001-1v-3a1 1 0 00-1-1h-5zm-4-3H3v7h5v-7zM3 9a1 1 0 00-1 1v7a1 1 0 001 1h5a1 1 0 001-1v-7a1 1 0 00-1-1H3zm14-6h-5v7h5V3zm-5-1a1 1 0 00-1 1v7a1 1 0 001 1h5a1 1 0 001-1V3a1 1 0 00-1-1h-5z" clip-rule="evenodd"/>');
var BIconCommand = /*#__PURE__*/makeIcon('Command', '<path fill-rule="evenodd" d="M4 5.5A1.5 1.5 0 005.5 7H7V5.5a1.5 1.5 0 10-3 0zM8 8V5.5A2.5 2.5 0 105.5 8H8zm8-2.5A1.5 1.5 0 0114.5 7H13V5.5a1.5 1.5 0 013 0zM12 8V5.5A2.5 2.5 0 1114.5 8H12zm-8 6.5A1.5 1.5 0 015.5 13H7v1.5a1.5 1.5 0 01-3 0zM8 12v2.5A2.5 2.5 0 115.5 12H8zm8 2.5a1.5 1.5 0 00-1.5-1.5H13v1.5a1.5 1.5 0 003 0zM12 12v2.5a2.5 2.5 0 102.5-2.5H12z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 8H8v4h4V8zM7 7v6h6V7H7z" clip-rule="evenodd"/>');
var BIconCompass = /*#__PURE__*/makeIcon('Compass', '<path fill-rule="evenodd" d="M10 17.016a6.5 6.5 0 100-13 6.5 6.5 0 000 13zm0 1a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" clip-rule="evenodd"/><rect width="4" height="2" x="8" y="2" rx="1"/><path d="M8.94 9.44l4.95-2.83-2.83 4.95-4.95 2.83 2.83-4.95z"/>');
var BIconCone = /*#__PURE__*/makeIcon('Cone', '<path d="M9.03 3.88c.252-1.01 1.688-1.01 1.94 0L14 16H6L9.03 3.88z"/><path fill-rule="evenodd" d="M3.5 16a.5.5 0 01.5-.5h12a.5.5 0 010 1H4a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconConeStriped = /*#__PURE__*/makeIcon('ConeStriped', '<path fill-rule="evenodd" d="M9.879 13.015a.5.5 0 01.242 0l6 1.5a.5.5 0 01.037.96l-6 2a.499.499 0 01-.316 0l-6-2a.5.5 0 01.037-.96l6-1.5z" clip-rule="evenodd"/><path d="M13.885 14.538l-.72-2.877c-.862.212-1.964.339-3.165.339s-2.303-.127-3.165-.339l-.72 2.877c-.073.292-.002.6.256.756.49.295 1.545.706 3.629.706s3.14-.411 3.63-.706c.257-.155.328-.464.255-.756zM11.97 6.88l.953 3.811C12.159 10.878 11.14 11 10 11c-1.14 0-2.159-.122-2.923-.309L8.03 6.88C8.635 6.957 9.3 7 10 7s1.365-.043 1.97-.12zm-.245-.978L10.97 2.88c-.252-1.01-1.688-1.01-1.94 0L8.275 5.9C8.8 5.965 9.382 6 10 6c.618 0 1.2-.036 1.725-.098z"/>');
var BIconController = /*#__PURE__*/makeIcon('Controller', '<path fill-rule="evenodd" d="M13.119 4.693c.904.19 1.75.495 2.235.98.407.408.779 1.05 1.094 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.815-.059 1.602-.328 2.21a1.42 1.42 0 01-1.445.83c-.636-.067-1.115-.394-1.513-.773a11.307 11.307 0 01-.739-.809c-.126-.147-.25-.291-.368-.422-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.422-.243.283-.494.576-.739.81-.398.378-.877.705-1.513.772a1.42 1.42 0 01-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772.486-.485 1.331-.79 2.235-.98.932-.196 2.03-.292 3.119-.292 1.089 0 2.187.096 3.119.292zm-6.032.979c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 00-.748 2.295 12.35 12.35 0 00-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 00.426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.505.826-.912 1.943-1.854 3.965-1.854s3.139.942 3.965 1.854c.164.182.307.35.44.505.214.25.403.472.615.674.318.303.601.468.929.503a.42.42 0 00.426-.241c.18-.408.265-1.02.243-1.776a12.353 12.353 0 00-.339-2.406 13.753 13.753 0 00-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z" clip-rule="evenodd"/><path d="M13.5 8.026a.5.5 0 11-1 0 .5.5 0 011 0zm-1 1a.5.5 0 11-1 0 .5.5 0 011 0zm2 0a.5.5 0 11-1 0 .5.5 0 011 0zm-1 1.001a.5.5 0 11-1 0 .5.5 0 011 0zm-7-2.501h1v3h-1v-3z"/><path d="M5.5 8.526h3v1h-3v-1zM5.051 5.26a.5.5 0 01.354-.613l1.932-.518a.5.5 0 01.258.966l-1.932.518a.5.5 0 01-.612-.354zm9.976 0a.5.5 0 00-.353-.613l-1.932-.518a.5.5 0 10-.259.966l1.932.518a.5.5 0 00.612-.354z"/>');
var BIconCreditCard = /*#__PURE__*/makeIcon('CreditCard', '<path fill-rule="evenodd" d="M16 5H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1zM4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clip-rule="evenodd"/><rect width="3" height="3" x="4" y="11" rx="1"/><path d="M3 7h14v2H3z"/>');
var BIconCursor = /*#__PURE__*/makeIcon('Cursor', '<path fill-rule="evenodd" d="M16.081 4.182a.5.5 0 01.104.557l-5.657 12.727a.5.5 0 01-.917-.006L7.57 12.694l-4.766-2.042a.5.5 0 01-.006-.917L15.525 4.08a.5.5 0 01.556.103zM4.25 10.184l3.897 1.67a.5.5 0 01.262.263l1.67 3.897L14.743 5.52 4.25 10.184z" clip-rule="evenodd"/>');
var BIconCursorFill = /*#__PURE__*/makeIcon('CursorFill', '<path fill-rule="evenodd" d="M16.081 4.182a.5.5 0 01.104.557l-5.657 12.727a.5.5 0 01-.917-.006L7.57 12.694l-4.766-2.042a.5.5 0 01-.006-.917L15.525 4.08a.5.5 0 01.556.103z" clip-rule="evenodd"/>');
var BIconDash = /*#__PURE__*/makeIcon('Dash', '<path fill-rule="evenodd" d="M5.5 10a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconDiamond = /*#__PURE__*/makeIcon('Diamond', '<path fill-rule="evenodd" d="M5.1 2.7a.5.5 0 01.4-.2h9a.5.5 0 01.4.2l2.976 3.974c.149.185.156.45.01.644L10.4 17.3a.5.5 0 01-.8 0l-7.5-10a.5.5 0 010-.6l3-4zm11.386 3.785l-1.806-2.41-.776 2.413 2.582-.003zm-3.633.004l.961-2.989H6.186l.963 2.995 5.704-.006zM7.47 7.495l5.062-.005L10 15.366 7.47 7.495zm-1.371-.999l-.78-2.422-1.818 2.425 2.598-.003zM3.499 7.5l2.92-.003 2.193 6.82L3.5 7.5zm7.889 6.817l2.194-6.828 2.929-.003-5.123 6.831z" clip-rule="evenodd"/>');
var BIconDiamondHalf = /*#__PURE__*/makeIcon('DiamondHalf', '<path fill-rule="evenodd" d="M8.94 2.354a1.5 1.5 0 012.12 0l6.586 6.585a1.5 1.5 0 010 2.122l-6.585 6.585a1.5 1.5 0 01-2.122 0l-6.585-6.585a1.5 1.5 0 010-2.122l6.585-6.585zm1.06.56a.498.498 0 00-.354.147L3.061 9.646a.5.5 0 000 .707l6.585 6.586a.499.499 0 00.354.147V2.914z" clip-rule="evenodd"/>');
var BIconDisplay = /*#__PURE__*/makeIcon('Display', '<path d="M7.75 15.5c.167-.333.25-.833.25-1.5h4c0 .667.083 1.167.25 1.5H13a.5.5 0 010 1H7a.5.5 0 010-1h.75z"/><path fill-rule="evenodd" d="M15.991 5H4c-.325 0-.502.078-.602.145a.758.758 0 00-.254.302A1.46 1.46 0 003 6.01V12c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 00.538.143L4.01 13H16c.325 0 .502-.078.602-.145a.758.758 0 00.254-.302 1.464 1.464 0 00.143-.538L17 11.99V6c0-.325-.078-.502-.145-.602a.757.757 0 00-.302-.254A1.46 1.46 0 0015.99 5zM16 4H4C2 4 2 6 2 6v6c0 2 2 2 2 2h12c2 0 2-2 2-2V6c0-2-2-2-2-2z" clip-rule="evenodd"/>');
var BIconDisplayFill = /*#__PURE__*/makeIcon('DisplayFill', '<path d="M7.75 15.5c.167-.333.25-.833.25-1.5h4c0 .667.083 1.167.25 1.5H13a.5.5 0 010 1H7a.5.5 0 010-1h.75z"/><path fill-rule="evenodd" d="M15.991 5H4c-.325 0-.502.078-.602.145a.758.758 0 00-.254.302A1.46 1.46 0 003 6.01V12c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 00.538.143L4.01 13H16c.325 0 .502-.078.602-.145a.758.758 0 00.254-.302 1.464 1.464 0 00.143-.538L17 11.99V6c0-.325-.078-.502-.145-.602a.757.757 0 00-.302-.254A1.46 1.46 0 0015.99 5zM16 4H4C2 4 2 6 2 6v6c0 2 2 2 2 2h12c2 0 2-2 2-2V6c0-2-2-2-2-2z" clip-rule="evenodd"/><path d="M4 6h12v6H4z"/>');
var BIconDocument = /*#__PURE__*/makeIcon('Document', '<path fill-rule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clip-rule="evenodd"/>');
var BIconDocumentCode = /*#__PURE__*/makeIcon('DocumentCode', '<path fill-rule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10.646 7.646a.5.5 0 01.708 0l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L12.293 10l-1.647-1.646a.5.5 0 010-.708zm-1.292 0a.5.5 0 00-.708 0l-2 2a.5.5 0 000 .708l2 2a.5.5 0 00.708-.708L7.707 10l1.647-1.646a.5.5 0 000-.708z" clip-rule="evenodd"/>');
var BIconDocumentDiff = /*#__PURE__*/makeIcon('DocumentDiff', '<path fill-rule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.5 13a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zM10 6.5a.5.5 0 01.5.5v4a.5.5 0 01-1 0V7a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.5 9a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconDocumentRichtext = /*#__PURE__*/makeIcon('DocumentRichtext', '<path fill-rule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.5 14a.5.5 0 01.5-.5h3a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm1.639-3.958l1.33.886 1.854-1.855a.25.25 0 01.289-.047L13.5 8v1.75a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5v-.5s1.54-1.274 1.639-1.208zM8.25 7a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>');
var BIconDocumentSpreadsheet = /*#__PURE__*/makeIcon('DocumentSpreadsheet', '<path fill-rule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M15 8H5V7h10v1zm0 3H5v-1h10v1zm0 3H5v-1h10v1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7 16V8h1v8H7zm4 0V8h1v8h-1z" clip-rule="evenodd"/>');
var BIconDocumentText = /*#__PURE__*/makeIcon('DocumentText', '<path fill-rule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6.5 14a.5.5 0 01.5-.5h3a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconDocuments = /*#__PURE__*/makeIcon('Documents', '<path fill-rule="evenodd" d="M5 4h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H5z" clip-rule="evenodd"/><path d="M7 2h8a2 2 0 012 2v10a2 2 0 01-2 2v-1a1 1 0 001-1V4a1 1 0 00-1-1H7a1 1 0 00-1 1H5a2 2 0 012-2z"/>');
var BIconDocumentsAlt = /*#__PURE__*/makeIcon('DocumentsAlt', '<path fill-rule="evenodd" d="M5 3h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H5z" clip-rule="evenodd"/><path d="M15 6V5a2 2 0 012 2v6a2 2 0 01-2 2v-1a1 1 0 001-1V7a1 1 0 00-1-1z"/>');
var BIconDot = /*#__PURE__*/makeIcon('Dot', '<path fill-rule="evenodd" d="M10 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/>');
var BIconDownload = /*#__PURE__*/makeIcon('Download', '<path fill-rule="evenodd" d="M2.5 10a.5.5 0 01.5.5V14a1 1 0 001 1h12a1 1 0 001-1v-3.5a.5.5 0 011 0V14a2 2 0 01-2 2H4a2 2 0 01-2-2v-3.5a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7 9.5a.5.5 0 01.707 0L10 11.793 12.293 9.5a.5.5 0 01.707.707l-2.646 2.647a.5.5 0 01-.708 0L7 10.207A.5.5 0 017 9.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 3a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 0110 3z" clip-rule="evenodd"/>');
var BIconEggFried = /*#__PURE__*/makeIcon('EggFried', '<path fill-rule="evenodd" d="M15.665 8.113a1 1 0 01-.667-.977L15 7a4 4 0 00-6.483-3.136 1 1 0 01-.8.2 4 4 0 00-3.693 6.61 1 1 0 01.2 1 4 4 0 006.67 4.087 1 1 0 011.262-.152 2.5 2.5 0 003.715-2.905 1 1 0 01.341-1.113 2.001 2.001 0 00-.547-3.478zM16 7c0 .057 0 .113-.003.17a3.001 3.001 0 01.822 5.216 3.5 3.5 0 01-5.201 4.065 5 5 0 01-8.336-5.109A5 5 0 017.896 3.08 5 5 0 0116 7z" clip-rule="evenodd"/><circle cx="10" cy="10" r="3"/>');
var BIconEject = /*#__PURE__*/makeIcon('Eject', '<path fill-rule="evenodd" d="M9.27 3.047a1 1 0 011.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H3.656c-.876 0-1.33-1.045-.73-1.684L9.27 3.047zm7.076 7.453L10 3.731 3.654 10.5h12.692zM2.5 13.5a1 1 0 011-1h13a1 1 0 011 1v1a1 1 0 01-1 1h-13a1 1 0 01-1-1v-1zm14 0h-13v1h13v-1z" clip-rule="evenodd"/>');
var BIconEjectFill = /*#__PURE__*/makeIcon('EjectFill', '<path fill-rule="evenodd" d="M9.27 3.047a1 1 0 011.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H3.656c-.876 0-1.33-1.045-.73-1.684L9.27 3.047zM2.5 13.5a1 1 0 011-1h13a1 1 0 011 1v1a1 1 0 01-1 1h-13a1 1 0 01-1-1v-1z" clip-rule="evenodd"/>');
var BIconEnvelope = /*#__PURE__*/makeIcon('Envelope', '<path fill-rule="evenodd" d="M16 5H4a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1zM4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M2.071 6.243a.5.5 0 01.686-.172L10 10.417l7.243-4.346a.5.5 0 11.514.858L10 11.583 2.243 6.93a.5.5 0 01-.172-.686z" clip-rule="evenodd"/>');
var BIconEnvelopeFill = /*#__PURE__*/makeIcon('EnvelopeFill', '<path d="M2.05 5.555L10 10.414l7.95-4.859A2 2 0 0016 4H4a2 2 0 00-1.95 1.555zM18 6.697l-5.875 3.59L18 13.743V6.697zm-.168 8.108l-6.675-3.926-1.157.707-1.157-.707-6.675 3.926A2 2 0 004 16h12a2 2 0 001.832-1.195zM2 13.743l5.875-3.456L2 6.697v7.046z"/>');
var BIconEnvelopeOpen = /*#__PURE__*/makeIcon('EnvelopeOpen', '<path fill-rule="evenodd" d="M2.243 8.929l.514-.858L10 12.417l7.243-4.346.514.858L10 13.583 2.243 8.93z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.184 12.68l-6.432 3.752-.504-.864 6.432-3.752.504.864zm1.632 0l6.432 3.752.504-.864-6.432-3.752-.504.864z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10.47 3.318a1 1 0 00-.94 0l-6 3.2A1 1 0 003 7.4V16a1 1 0 001 1h12a1 1 0 001-1V7.4a1 1 0 00-.53-.882l-6-3.2zm-1.41-.883a2 2 0 011.882 0l6 3.2A2 2 0 0118 7.4V16a2 2 0 01-2 2H4a2 2 0 01-2-2V7.4a2 2 0 011.059-1.765l6-3.2z" clip-rule="evenodd"/>');
var BIconEnvelopeOpenFill = /*#__PURE__*/makeIcon('EnvelopeOpenFill', '<path fill-rule="evenodd" d="M10.941 2.435a2 2 0 00-1.882 0l-6 3.2A2 2 0 002 7.4v.125l8 4.889 8-4.889V7.4a2 2 0 00-1.059-1.765l-6-3.2zM18 8.697l-5.875 3.59L18 15.743V8.697zm-.168 8.108l-6.586-3.874-.088-.052-.897.548-.261.159-.26-.16-.897-.547-.09.052-6.585 3.874A2 2 0 004 18h12a2 2 0 001.832-1.195zM2 15.743l5.875-3.456L2 8.697v7.046z" clip-rule="evenodd"/>');
var BIconEye = /*#__PURE__*/makeIcon('Eye', '<path fill-rule="evenodd" d="M18 10s-3-5.5-8-5.5S2 10 2 10s3 5.5 8 5.5 8-5.5 8-5.5zM3.173 10a13.133 13.133 0 001.66 2.043C6.12 13.332 7.88 14.5 10 14.5c2.12 0 3.879-1.168 5.168-2.457A13.133 13.133 0 0016.828 10a13.133 13.133 0 00-1.66-2.043C13.879 6.668 12.119 5.5 10 5.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 003.172 10z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6.5 10a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" clip-rule="evenodd"/>');
var BIconEyeFill = /*#__PURE__*/makeIcon('EyeFill', '<path d="M12.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/><path fill-rule="evenodd" d="M2 10s3-5.5 8-5.5 8 5.5 8 5.5-3 5.5-8 5.5S2 10 2 10zm8 3.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clip-rule="evenodd"/>');
var BIconEyeSlash = /*#__PURE__*/makeIcon('EyeSlash', '<path d="M15.359 13.238C17.06 11.72 18 10 18 10s-3-5.5-8-5.5a7.028 7.028 0 00-2.79.588l.77.771A5.944 5.944 0 0110 5.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0116.828 10c-.058.087-.122.183-.195.288a13.14 13.14 0 01-1.465 1.755c-.165.165-.337.328-.517.486l.708.709z"/><path d="M13.297 11.176a3.5 3.5 0 00-4.474-4.474l.823.823a2.5 2.5 0 012.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 01-4.474-4.474l.823.823a2.5 2.5 0 002.829 2.829z"/><path d="M5.35 7.47c-.18.16-.353.322-.518.487A13.134 13.134 0 003.172 10l.195.288c.335.48.83 1.12 1.465 1.755C6.121 13.332 7.881 14.5 10 14.5c.716 0 1.39-.133 2.02-.36l.77.772A7.027 7.027 0 0110 15.5c-5 0-8-5.5-8-5.5s.939-1.721 2.641-3.238l.708.709z"/><path fill-rule="evenodd" d="M15.646 16.354l-12-12 .708-.708 12 12-.708.707z" clip-rule="evenodd"/>');
var BIconEyeSlashFill = /*#__PURE__*/makeIcon('EyeSlashFill', '<path d="M12.79 14.912l-1.614-1.615a3.5 3.5 0 01-4.474-4.474l-2.06-2.06C2.938 8.278 2 10 2 10s3 5.5 8 5.5a7.027 7.027 0 002.79-.588zM7.21 5.088A7.028 7.028 0 0110 4.5c5 0 8 5.5 8 5.5s-.939 1.72-2.641 3.238l-2.062-2.062a3.5 3.5 0 00-4.474-4.474L7.21 5.088z"/><path d="M7.525 9.646a2.5 2.5 0 002.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 012.829 2.829z"/><path fill-rule="evenodd" d="M15.646 16.354l-12-12 .708-.708 12 12-.708.707z" clip-rule="evenodd"/>');
var BIconFilter = /*#__PURE__*/makeIcon('Filter', '<path fill-rule="evenodd" d="M7.5 13a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h12a.5.5 0 010 1H4a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconFlag = /*#__PURE__*/makeIcon('Flag', '<path fill-rule="evenodd" d="M5.5 3a.5.5 0 01.5.5v13a.5.5 0 01-1 0v-13a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M5.762 4.558C6.735 3.909 7.348 3.5 8.5 3.5c.653 0 1.139.325 1.495.562l.032.022c.392.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 01.5.5v6a.5.5 0 01-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.718 2.718 0 0111 11.5c-.653 0-1.139-.325-1.495-.563l-.032-.021c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 11-.515-.858C6.735 9.909 7.348 9.5 8.5 9.5c.653 0 1.139.325 1.495.563l.032.021c.392.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.456-.204 1-.43 1.64-.512V4.543c-.433.074-.83.234-1.234.414l-.159.07c-.22.1-.453.205-.678.287A2.72 2.72 0 0111 5.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 01-.554-.832l.04-.026z" clip-rule="evenodd"/>');
var BIconFlagFill = /*#__PURE__*/makeIcon('FlagFill', '<path fill-rule="evenodd" d="M5.5 3a.5.5 0 01.5.5v13a.5.5 0 01-1 0v-13a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M5.762 4.558C6.735 3.909 7.348 3.5 8.5 3.5c.653 0 1.139.325 1.495.562l.032.022c.392.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 01.5.5v6a.5.5 0 01-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.718 2.718 0 0111 11.5c-.653 0-1.139-.325-1.495-.563l-.032-.021c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916A.5.5 0 015.5 11V5a.5.5 0 01.223-.416l.04-.026z" clip-rule="evenodd"/>');
var BIconFolder = /*#__PURE__*/makeIcon('Folder', '<path d="M11.828 6a3 3 0 01-2.12-.879l-.83-.828A1 1 0 008.173 4H4.5a1 1 0 00-1 .981L3.546 6h-1L2.5 5a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 0011.828 5v1z"/><path fill-rule="evenodd" d="M15.81 6H4.19a1 1 0 00-.996 1.09l.637 7a1 1 0 00.995.91h10.348a1 1 0 00.995-.91l.637-7A1 1 0 0015.81 6zM4.19 5a2 2 0 00-1.992 2.181l.637 7A2 2 0 004.826 16h10.348a2 2 0 001.991-1.819l.637-7A2 2 0 0015.81 5H4.19z" clip-rule="evenodd"/>');
var BIconFolderFill = /*#__PURE__*/makeIcon('FolderFill', '<path fill-rule="evenodd" d="M11.828 5h3.982a2 2 0 011.992 2.181l-.637 7A2 2 0 0115.174 16H4.826a2 2 0 01-1.991-1.819l-.637-7a1.99 1.99 0 01.342-1.31L2.5 5a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 0011.828 5zm-8.322.12C3.72 5.042 3.95 5 4.19 5h5.396l-.707-.707A1 1 0 008.172 4H4.5a1 1 0 00-1 .981l.006.139z" clip-rule="evenodd"/>');
var BIconFolderSymlink = /*#__PURE__*/makeIcon('FolderSymlink', '<path d="M11.828 6a3 3 0 01-2.12-.879l-.83-.828A1 1 0 008.173 4H4.5a1 1 0 00-1 .981L3.546 6h-1L2.5 5a2 2 0 012-2h3.672a2 2 0 011.414.586l.828.828A2 2 0 0011.828 5v1z"/><path fill-rule="evenodd" d="M15.81 6H4.19a1 1 0 00-.996 1.09l.637 7a1 1 0 00.995.91h10.348a1 1 0 00.995-.91l.637-7A1 1 0 0015.81 6zM4.19 5a2 2 0 00-1.992 2.181l.637 7A2 2 0 004.826 16h10.348a2 2 0 001.991-1.819l.637-7A2 2 0 0015.81 5H4.19z" clip-rule="evenodd"/><path d="M10.616 12.24l3.182-1.969a.442.442 0 000-.742l-3.182-1.97c-.27-.166-.616.036-.616.372V8.7c-.857 0-3.429 0-4 4.8 1.429-2.7 4-2.4 4-2.4v.769c0 .336.346.538.616.371z"/>');
var BIconFolderSymlinkFill = /*#__PURE__*/makeIcon('FolderSymlinkFill', '<path fill-rule="evenodd" d="M15.81 5h-3.982a2 2 0 01-1.414-.586l-.828-.828A2 2 0 008.172 3H4.5a2 2 0 00-2 2l.04.87a1.99 1.99 0 00-.342 1.311l.637 7A2 2 0 004.826 16h10.348a2 2 0 001.991-1.819l.637-7A2 2 0 0015.81 5zM4.19 5c-.24 0-.47.042-.684.12L3.5 4.98a1 1 0 011-.98h3.672a1 1 0 01.707.293L9.586 5H4.19zm9.608 5.271l-3.182 1.97c-.27.166-.616-.036-.616-.372V11.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742z" clip-rule="evenodd"/>');
var BIconFonts = /*#__PURE__*/makeIcon('Fonts', '<path d="M14.258 5H5.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V5.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L14.258 5z"/>');
var BIconForward = /*#__PURE__*/makeIcon('Forward', '<path fill-rule="evenodd" d="M11.502 7.513a.144.144 0 00-.202.134V8.65a.5.5 0 01-.5.5H4.5v2.9h6.3a.5.5 0 01.5.5v1.003c0 .108.11.176.202.134l3.984-2.933a.522.522 0 01.042-.028.147.147 0 000-.252.523.523 0 01-.042-.028l-3.984-2.933zm-1.202.134a1.144 1.144 0 011.767-.96l3.994 2.94a1.147 1.147 0 010 1.946l-3.994 2.94a1.144 1.144 0 01-1.767-.96v-.503H4a.5.5 0 01-.5-.5v-3.9a.5.5 0 01.5-.5h6.3v-.503z" clip-rule="evenodd"/>');
var BIconForwardFill = /*#__PURE__*/makeIcon('ForwardFill', '<path d="M11.77 14.11l4.012-2.953a.647.647 0 000-1.114L11.771 7.09a.644.644 0 00-.971.557V8.65H4v3.9h6.8v1.003c0 .505.545.808.97.557z"/>');
var BIconGear = /*#__PURE__*/makeIcon('Gear', '<path fill-rule="evenodd" d="M10.837 3.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 016.377 5.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 01-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 011.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 012.692 1.115l.094.319c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 012.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 011.115-2.693l.319-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 01-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159a1.873 1.873 0 01-2.693-1.115l-.094-.319zm-2.633-.283c.527-1.79 3.064-1.79 3.592 0l.094.319a.873.873 0 001.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 00.52 1.255l.319.094c1.79.527 1.79 3.064 0 3.592l-.319.094a.873.873 0 00-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 00-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 00-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 00-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 00.52-1.255l-.16-.292c-.892-1.64.901-3.433 2.541-2.54l.292.159a.873.873 0 001.255-.52l.094-.319z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 7.754a2.246 2.246 0 100 4.492 2.246 2.246 0 000-4.492zM6.754 10a3.246 3.246 0 116.492 0 3.246 3.246 0 01-6.492 0z" clip-rule="evenodd"/>');
var BIconGearFill = /*#__PURE__*/makeIcon('GearFill', '<path fill-rule="evenodd" d="M11.405 3.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 01-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 01.872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 012.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 012.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 01.872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 01-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 01-2.105-.872l-.1-.34zM10 12.93a2.929 2.929 0 100-5.858 2.929 2.929 0 000 5.858z" clip-rule="evenodd"/>');
var BIconGearWide = /*#__PURE__*/makeIcon('GearWide', '<path fill-rule="evenodd" d="M10.932 2.724c-.243-.97-1.621-.97-1.864 0l-.072.286a.96.96 0 01-1.622.434l-.205-.211c-.695-.72-1.889-.03-1.614.932l.08.283a.96.96 0 01-1.187 1.188l-.283-.081c-.962-.275-1.651.919-.932 1.614l.211.205a.96.96 0 01-.434 1.622l-.286.072c-.97.243-.97 1.621 0 1.864l.286.072a.96.96 0 01.434 1.622l-.211.205c-.72.695-.03 1.889.932 1.614l.283-.08a.96.96 0 011.188 1.187l-.081.283c-.275.962.919 1.651 1.614.932l.205-.211a.96.96 0 011.622.434l.072.286c.243.97 1.621.97 1.864 0l.072-.286a.96.96 0 011.622-.434l.205.211c.695.72 1.889.03 1.614-.932l-.08-.283a.96.96 0 011.187-1.188l.283.081c.962.275 1.651-.919.932-1.614l-.211-.205a.96.96 0 01.434-1.622l.286-.072c.97-.243.97-1.621 0-1.864l-.286-.072a.96.96 0 01-.434-1.622l.211-.205c.72-.695.03-1.889-.932-1.614l-.283.08a.96.96 0 01-1.188-1.187l.081-.283c.275-.962-.919-1.651-1.614-.932l-.205.211a.96.96 0 01-1.622-.434l-.072-.286zM10 15a5 5 0 100-10 5 5 0 000 10z" clip-rule="evenodd"/>');
var BIconGearWideConnected = /*#__PURE__*/makeIcon('GearWideConnected', '<path fill-rule="evenodd" d="M10.932 2.724c-.243-.97-1.621-.97-1.864 0l-.072.286a.96.96 0 01-1.622.434l-.205-.211c-.695-.72-1.889-.03-1.614.932l.08.283a.96.96 0 01-1.187 1.188l-.283-.081c-.962-.275-1.651.919-.932 1.614l.211.205a.96.96 0 01-.434 1.622l-.286.072c-.97.243-.97 1.621 0 1.864l.286.072a.96.96 0 01.434 1.622l-.211.205c-.72.695-.03 1.889.932 1.614l.283-.08a.96.96 0 011.188 1.187l-.081.283c-.275.962.919 1.651 1.614.932l.205-.211a.96.96 0 011.622.434l.072.286c.243.97 1.621.97 1.864 0l.072-.286a.96.96 0 011.622-.434l.205.211c.695.72 1.889.03 1.614-.932l-.08-.283a.96.96 0 011.187-1.188l.283.081c.962.275 1.651-.919.932-1.614l-.211-.205a.96.96 0 01.434-1.622l.286-.072c.97-.243.97-1.621 0-1.864l-.286-.072a.96.96 0 01-.434-1.622l.211-.205c.72-.695.03-1.889-.932-1.614l-.283.08a.96.96 0 01-1.188-1.187l.081-.283c.275-.962-.919-1.651-1.614-.932l-.205.211a.96.96 0 01-1.622-.434l-.072-.286zM10 15a5 5 0 100-10 5 5 0 000 10z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.375 10L6.6 6.3l.8-.6 2.85 3.8H15v1h-4.75L7.4 14.3l-.8-.6L9.375 10z" clip-rule="evenodd"/>');
var BIconGeo = /*#__PURE__*/makeIcon('Geo', '<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M9.5 6h1v9a.5.5 0 01-1 0V6z"/><path fill-rule="evenodd" d="M8.489 14.095a.5.5 0 01-.383.594c-.565.123-1.003.292-1.286.472-.302.192-.32.321-.32.339 0 .013.005.085.146.21.14.124.372.26.701.383.655.245 1.593.407 2.653.407s1.998-.162 2.653-.407c.329-.124.56-.259.701-.383.14-.125.146-.197.146-.21 0-.018-.018-.147-.32-.339-.283-.18-.721-.35-1.286-.472a.5.5 0 11.212-.977c.63.137 1.193.34 1.61.606.4.253.784.645.784 1.182 0 .402-.219.724-.483.958-.264.235-.618.423-1.013.57-.793.298-1.855.472-3.004.472s-2.21-.174-3.004-.471c-.395-.148-.749-.337-1.013-.571-.264-.234-.483-.556-.483-.958 0-.537.384-.929.783-1.182.418-.266.98-.47 1.611-.606a.5.5 0 01.595.383z" clip-rule="evenodd"/>');
var BIconGraphDown = /*#__PURE__*/makeIcon('GraphDown', '<path d="M2 2h1v16H2V2zm1 15h15v1H3v-1z"/><path fill-rule="evenodd" d="M16.39 11.041l-4.349-5.436L9 8.646 5.354 5l-.708.707L9 10.061l2.959-2.959 3.65 4.564.781-.625z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 11.854a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v3.5h-3.5a.5.5 0 00-.5.5z" clip-rule="evenodd"/>');
var BIconGraphUp = /*#__PURE__*/makeIcon('GraphUp', '<path d="M2 2h1v16H2V2zm1 15h15v1H3v-1z"/><path fill-rule="evenodd" d="M16.39 6.312l-4.349 5.437L9 8.707l-3.646 3.647-.708-.708L9 7.293l2.959 2.958 3.65-4.563.781.624z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 5.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V6h-3.5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconGrid = /*#__PURE__*/makeIcon('Grid', '<path fill-rule="evenodd" d="M9.5 4.5a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4zm-1 7h-4v4h4v-4zm7 0h-4v4h4v-4zm0-7h-4v4h4v-4zm-7 0h-4v4h4v-4zm2 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4zm-6 6a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4zm7 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" clip-rule="evenodd"/>');
var BIconGridFill = /*#__PURE__*/makeIcon('GridFill', '<rect width="6" height="6" x="3.5" y="10.5" rx="1"/><rect width="6" height="6" x="10.5" y="10.5" rx="1"/><rect width="6" height="6" x="10.5" y="3.5" rx="1"/><rect width="6" height="6" x="3.5" y="3.5" rx="1"/>');
var BIconHammer = /*#__PURE__*/makeIcon('Hammer', '<path d="M11.812 3.952a.5.5 0 01-.312.89c-1.671 0-2.852.596-3.616 1.185L6.857 7.073V8.21a.5.5 0 01-.146.354L5.426 9.853a.5.5 0 01-.709 0L2.146 7.274a.5.5 0 010-.706l1.286-1.29a.5.5 0 01.354-.146H4.84c1.664-1.904 3.375-2.27 4.716-2.091a5.008 5.008 0 012.076.782l.18.129z"/><path fill-rule="evenodd" d="M8.012 5.5a.5.5 0 01.359.165l9.146 8.646A.5.5 0 0117.5 15L16 16.5a.5.5 0 01-.756-.056L6.598 7.297a.5.5 0 01.048-.65l1-1a.5.5 0 01.366-.147z" clip-rule="evenodd"/>');
var BIconHash = /*#__PURE__*/makeIcon('Hash', '<path d="M10.39 14.648a1.32 1.32 0 00-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304c.008-.04.016-.117.016-.164a.51.51 0 00-.516-.516.54.54 0 00-.539.43l-.523 2.554H9.617l.477-2.304c.008-.04.015-.117.015-.164a.512.512 0 00-.523-.516.539.539 0 00-.531.43L8.53 7.484H7.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H6.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H8.859l.532-2.563z"/>');
var BIconHeart = /*#__PURE__*/makeIcon('Heart', '<path fill-rule="evenodd" d="M10 4.748l-.717-.737C7.6 2.281 4.514 2.878 3.4 5.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.837-3.362.314-4.385-1.114-2.175-4.2-2.773-5.883-1.043L10 4.748zM10 17C-5.333 6.868 5.279-1.04 9.824 3.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C14.72-1.042 25.333 6.867 10 17z" clip-rule="evenodd"/>');
var BIconHeartFill = /*#__PURE__*/makeIcon('HeartFill', '<path fill-rule="evenodd" d="M10 3.314C14.438-1.248 25.534 6.735 10 17-5.534 6.736 5.562-1.248 10 3.314z" clip-rule="evenodd"/>');
var BIconHouse = /*#__PURE__*/makeIcon('House', '<path fill-rule="evenodd" d="M9.646 3.146a.5.5 0 01.708 0l6 6a.5.5 0 01.146.354v7a.5.5 0 01-.5.5h-4.5a.5.5 0 01-.5-.5v-4H9v4a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-7a.5.5 0 01.146-.354l6-6zM4.5 9.707V16H8v-4a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v4h3.5V9.707l-5.5-5.5-5.5 5.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M15 4.5V8l-2-2V4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z" clip-rule="evenodd"/>');
var BIconHouseFill = /*#__PURE__*/makeIcon('HouseFill', '<path d="M8.5 12.995V16.5a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-7a.5.5 0 01.146-.354l6-6a.5.5 0 01.708 0l6 6a.5.5 0 01.146.354v7a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5V13c0-.25-.25-.5-.5-.5H9c-.25 0-.5.25-.5.495z"/><path fill-rule="evenodd" d="M15 4.5V8l-2-2V4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z" clip-rule="evenodd"/>');
var BIconImage = /*#__PURE__*/makeIcon('Image', '<path fill-rule="evenodd" d="M16.002 4h-12a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zm-12-1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-12z" clip-rule="evenodd"/><path d="M12.648 9.646a.5.5 0 01.577-.093l3.777 1.947V16h-14v-2l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71z"/><path fill-rule="evenodd" d="M6.502 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/>');
var BIconImageAlt = /*#__PURE__*/makeIcon('ImageAlt', '<path d="M12.648 8.646a.5.5 0 01.577-.093l4.777 3.947V17a1 1 0 01-1 1h-14a1 1 0 01-1-1v-2l3.646-4.354a.5.5 0 01.63-.062l2.66 2.773 3.71-4.71z"/><path fill-rule="evenodd" d="M6.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/>');
var BIconImageFill = /*#__PURE__*/makeIcon('ImageFill', '<path fill-rule="evenodd" d="M2.002 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-12a2 2 0 01-2-2V5zm1 9l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71a.5.5 0 01.577-.094l3.777 1.947V15a1 1 0 01-1 1h-12a1 1 0 01-1-1v-1zm5-6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clip-rule="evenodd"/>');
var BIconImages = /*#__PURE__*/makeIcon('Images', '<path fill-rule="evenodd" d="M14.002 6h-10a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1zm-10-1a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-10z" clip-rule="evenodd"/><path d="M12.648 10.646a.5.5 0 01.577-.093l1.777 1.947V16h-12v-1l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71z"/><path fill-rule="evenodd" d="M6.502 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6 4h10a1 1 0 011 1v8a1 1 0 01-1 1v1a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2h1a1 1 0 011-1z" clip-rule="evenodd"/>');
var BIconInbox = /*#__PURE__*/makeIcon('Inbox', '<path fill-rule="evenodd" d="M5.81 6.063A1.5 1.5 0 016.98 5.5h6.04a1.5 1.5 0 011.17.563l3.7 4.625a.5.5 0 11-.78.624l-3.7-4.624a.5.5 0 00-.39-.188H6.98a.5.5 0 00-.39.188l-3.7 4.624a.5.5 0 11-.78-.624l3.7-4.625z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M2.125 10.67a.5.5 0 01.375-.17H8a.5.5 0 01.5.5 1.5 1.5 0 003 0 .5.5 0 01.5-.5h5.5a.5.5 0 01.496.562l-.39 3.124a1.5 1.5 0 01-1.489 1.314H3.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393zm.941.83l.32 2.562a.5.5 0 00.497.438h12.234a.5.5 0 00.496-.438l.32-2.562H12.45a2.5 2.5 0 01-4.9 0H3.066z" clip-rule="evenodd"/>');
var BIconInboxFill = /*#__PURE__*/makeIcon('InboxFill', '<path fill-rule="evenodd" d="M5.81 6.063A1.5 1.5 0 016.98 5.5h6.04a1.5 1.5 0 011.17.563l3.7 4.625a.5.5 0 11-.78.624l-3.7-4.624a.5.5 0 00-.39-.188H6.98a.5.5 0 00-.39.188l-3.7 4.624a.5.5 0 11-.78-.624l3.7-4.625z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M2.125 10.67a.5.5 0 01.375-.17h5a.5.5 0 01.5.5c0 .828.625 2 2 2s2-1.172 2-2a.5.5 0 01.5-.5h5a.5.5 0 01.496.562l-.39 3.124a1.5 1.5 0 01-1.489 1.314H3.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393z" clip-rule="evenodd"/>');
var BIconInboxes = /*#__PURE__*/makeIcon('Inboxes', '<path fill-rule="evenodd" d="M2.125 13.17A.5.5 0 012.5 13H8a.5.5 0 01.5.5 1.5 1.5 0 003 0 .5.5 0 01.5-.5h5.5a.5.5 0 01.496.562l-.39 3.124A1.5 1.5 0 0116.117 18H3.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393zm.941.83l.32 2.562a.5.5 0 00.497.438h12.234a.5.5 0 00.496-.438l.32-2.562H12.45a2.5 2.5 0 01-4.9 0H3.066zM5.81 2.563A1.5 1.5 0 016.98 2h6.04a1.5 1.5 0 011.17.563l3.7 4.625a.5.5 0 11-.78.624l-3.7-4.624A.5.5 0 0013.02 3H6.98a.5.5 0 00-.39.188l-3.7 4.624a.5.5 0 11-.78-.624l3.7-4.625z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M2.125 7.17A.5.5 0 012.5 7H8a.5.5 0 01.5.5 1.5 1.5 0 003 0A.5.5 0 0112 7h5.5a.5.5 0 01.496.562l-.39 3.124A1.5 1.5 0 0116.117 12H3.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393zm.941.83l.32 2.562a.5.5 0 00.497.438h12.234a.5.5 0 00.496-.438L16.933 8H12.45a2.5 2.5 0 01-4.9 0H3.066z" clip-rule="evenodd"/>');
var BIconInboxesFill = /*#__PURE__*/makeIcon('InboxesFill', '<path fill-rule="evenodd" d="M2.125 13.17A.5.5 0 012.5 13H8a.5.5 0 01.5.5 1.5 1.5 0 003 0 .5.5 0 01.5-.5h5.5a.5.5 0 01.496.562l-.39 3.124A1.5 1.5 0 0116.117 18H3.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393zM5.81 2.563A1.5 1.5 0 016.98 2h6.04a1.5 1.5 0 011.17.563l3.7 4.625a.5.5 0 11-.78.624l-3.7-4.624A.5.5 0 0013.02 3H6.98a.5.5 0 00-.39.188l-3.7 4.624a.5.5 0 11-.78-.624l3.7-4.625z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M2.125 7.17A.5.5 0 012.5 7H8a.5.5 0 01.5.5 1.5 1.5 0 003 0A.5.5 0 0112 7h5.5a.5.5 0 01.496.562l-.39 3.124A1.5 1.5 0 0116.117 12H3.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393z" clip-rule="evenodd"/>');
var BIconInfo = /*#__PURE__*/makeIcon('Info', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm8-7a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/><path d="M10.93 8.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705z"/><circle cx="10" cy="6.5" r="1"/>');
var BIconInfoFill = /*#__PURE__*/makeIcon('InfoFill', '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>');
var BIconInfoSquare = /*#__PURE__*/makeIcon('InfoSquare', '<path fill-rule="evenodd" d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path d="M10.93 8.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705z"/><circle cx="10" cy="6.5" r="1"/>');
var BIconInfoSquareFill = /*#__PURE__*/makeIcon('InfoSquareFill', '<path fill-rule="evenodd" d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm8.93 4.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>');
var BIconJustify = /*#__PURE__*/makeIcon('Justify', '<path fill-rule="evenodd" d="M4 14.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconJustifyLeft = /*#__PURE__*/makeIcon('JustifyLeft', '<path fill-rule="evenodd" d="M4 14.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconJustifyRight = /*#__PURE__*/makeIcon('JustifyRight', '<path fill-rule="evenodd" d="M8 14.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-4-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconKanban = /*#__PURE__*/makeIcon('Kanban', '<path fill-rule="evenodd" d="M15.5 3h-11a1 1 0 00-1 1v12a1 1 0 001 1h11a1 1 0 001-1V4a1 1 0 00-1-1zm-11-1a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2h-11z" clip-rule="evenodd"/><rect width="3" height="5" x="8.5" y="4" rx="1"/><rect width="3" height="9" x="4.5" y="4" rx="1"/><rect width="3" height="12" x="12.5" y="4" rx="1"/>');
var BIconKanbanFill = /*#__PURE__*/makeIcon('KanbanFill', '<path fill-rule="evenodd" d="M4.5 2a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2h-11zm5 2a1 1 0 00-1 1v3a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1zm-5 1a1 1 0 011-1h1a1 1 0 011 1v7a1 1 0 01-1 1h-1a1 1 0 01-1-1V5zm9-1a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clip-rule="evenodd"/>');
var BIconLaptop = /*#__PURE__*/makeIcon('Laptop', '<path fill-rule="evenodd" d="M15.5 4h-11a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5zm-11-1A1.5 1.5 0 003 4.5v7A1.5 1.5 0 004.5 13h11a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0015.5 3h-11z" clip-rule="evenodd"/><path d="M2.81 13.758A1 1 0 013.78 13h12.44a1 1 0 01.97.758l.5 2A1 1 0 0116.72 17H3.28a1 1 0 01-.97-1.242l.5-2z"/>');
var BIconLayoutSidebar = /*#__PURE__*/makeIcon('LayoutSidebar', '<path fill-rule="evenodd" d="M16 4H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M6 16V4h1v12H6z" clip-rule="evenodd"/>');
var BIconLayoutSidebarReverse = /*#__PURE__*/makeIcon('LayoutSidebarReverse', '<path fill-rule="evenodd" d="M16 4H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13 16V4h1v12h-1z" clip-rule="evenodd"/>');
var BIconLayoutSplit = /*#__PURE__*/makeIcon('LayoutSplit', '<path fill-rule="evenodd" d="M1.5 5A2.5 2.5 0 014 2.5h12A2.5 2.5 0 0118.5 5v10a2.5 2.5 0 01-2.5 2.5H4A2.5 2.5 0 011.5 15V5zM4 3.5A1.5 1.5 0 002.5 5v10A1.5 1.5 0 004 16.5h12a1.5 1.5 0 001.5-1.5V5A1.5 1.5 0 0016 3.5h-5.5v13h-1v-13H4z" clip-rule="evenodd"/>');
var BIconList = /*#__PURE__*/makeIcon('List', '<path fill-rule="evenodd" d="M4.5 13.5A.5.5 0 015 13h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5zm0-4A.5.5 0 015 9h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5zm0-4A.5.5 0 015 5h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconListCheck = /*#__PURE__*/makeIcon('ListCheck', '<path fill-rule="evenodd" d="M7 13.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM5.854 4.146a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 11.708-.708L4 5.293l1.146-1.147a.5.5 0 01.708 0zm0 4a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 11.708-.708L4 9.293l1.146-1.147a.5.5 0 01.708 0zm0 4a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 01.708-.708l.146.147 1.146-1.147a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconListOl = /*#__PURE__*/makeIcon('ListOl', '<path fill-rule="evenodd" d="M7 13.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path d="M3.713 13.865v-.474H4c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 01-.492.594v.033a.615.615 0 01.569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V11H3.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 00-.342.338v.041zM4.564 7h-.635V4.924h-.031l-.598.42v-.567l.629-.443h.635V7z"/>');
var BIconListTask = /*#__PURE__*/makeIcon('ListTask', '<path fill-rule="evenodd" d="M4 4.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V5a.5.5 0 00-.5-.5H4zM5 5H4v1h1V5z" clip-rule="evenodd"/><path d="M7 5.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM7.5 9a.5.5 0 000 1h9a.5.5 0 000-1h-9zm0 4a.5.5 0 000 1h9a.5.5 0 000-1h-9z"/><path fill-rule="evenodd" d="M3.5 9a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V9zM4 9h1v1H4V9zm0 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H4zm1 .5H4v1h1v-1z" clip-rule="evenodd"/>');
var BIconListUl = /*#__PURE__*/makeIcon('ListUl', '<path fill-rule="evenodd" d="M7 13.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm-3 1a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>');
var BIconLock = /*#__PURE__*/makeIcon('Lock', '<path fill-rule="evenodd" d="M13.655 9H6.333c-.264 0-.398.068-.471.121a.73.73 0 00-.224.296 1.626 1.626 0 00-.138.59V15c0 .342.076.531.14.635.064.106.151.18.256.237a1.122 1.122 0 00.436.127l.013.001h7.322c.264 0 .398-.068.471-.121a.73.73 0 00.224-.296 1.627 1.627 0 00.138-.59V10c0-.342-.076-.531-.14-.635a.658.658 0 00-.255-.237 1.123 1.123 0 00-.45-.128zm.012-1H6.333C4.5 8 4.5 10 4.5 10v5c0 2 1.833 2 1.833 2h7.334c1.833 0 1.833-2 1.833-2v-5c0-2-1.833-2-1.833-2zM6.5 5a3.5 3.5 0 117 0v3h-1V5a2.5 2.5 0 00-5 0v3h-1V5z" clip-rule="evenodd"/>');
var BIconLockFill = /*#__PURE__*/makeIcon('LockFill', '<rect width="11" height="9" x="4.5" y="8" rx="2"/><path fill-rule="evenodd" d="M6.5 5a3.5 3.5 0 117 0v3h-1V5a2.5 2.5 0 00-5 0v3h-1V5z" clip-rule="evenodd"/>');
var BIconMap = /*#__PURE__*/makeIcon('Map', '<path fill-rule="evenodd" d="M17.817 2.613A.5.5 0 0118 3v13a.5.5 0 01-.402.49l-5 1a.502.502 0 01-.196 0L7.5 16.51l-4.902.98A.5.5 0 012 17V4a.5.5 0 01.402-.49l5-1a.5.5 0 01.196 0l4.902.98 4.902-.98a.5.5 0 01.415.103zM12 4.41l-4-.8v11.98l4 .8V4.41zm1 11.98l4-.8V3.61l-4 .8v11.98zm-6-.8V3.61l-4 .8v11.98l4-.8z" clip-rule="evenodd"/>');
var BIconMic = /*#__PURE__*/makeIcon('Mic', '<path d="M7 5a3 3 0 016 0v5a3 3 0 11-6 0V5z"/><path fill-rule="evenodd" d="M5.5 8.5A.5.5 0 016 9v1a4 4 0 008 0V9a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V17h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 015 10V9a.5.5 0 01.5-.5z" clip-rule="evenodd"/>');
var BIconMoon = /*#__PURE__*/makeIcon('Moon', '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.002 8.002 0 1010.586 10.586z"/>');
var BIconMusicPlayer = /*#__PURE__*/makeIcon('MusicPlayer', '<path fill-rule="evenodd" d="M14 3H6a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1zM6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13 5H7v3h6V5zM7 4a1 1 0 00-1 1v3a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1H7zm3 11a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"/><circle cx="10" cy="13" r="1"/>');
var BIconMusicPlayerFill = /*#__PURE__*/makeIcon('MusicPlayerFill', '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 1a1 1 0 011-1h6a1 1 0 011 1v2.5a1 1 0 01-1 1H7a1 1 0 01-1-1V5zm7 8a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"/><circle cx="10" cy="13" r="1"/>');
var BIconOption = /*#__PURE__*/makeIcon('Option', '<path fill-rule="evenodd" d="M2.5 4.5A.5.5 0 013 4h4a.5.5 0 01.439.26L13.297 15H17a.5.5 0 010 1h-4a.5.5 0 01-.439-.26L6.703 5H3a.5.5 0 01-.5-.5zm10 0A.5.5 0 0113 4h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconOutlet = /*#__PURE__*/makeIcon('Outlet', '<path fill-rule="evenodd" d="M5.34 4.994c.275-.338.68-.494 1.074-.494h7.172c.393 0 .798.156 1.074.494.578.708 1.84 2.534 1.84 5.006 0 2.472-1.262 4.297-1.84 5.006-.276.338-.68.494-1.074.494H6.414c-.394 0-.799-.156-1.074-.494C4.762 14.297 3.5 12.472 3.5 10c0-2.472 1.262-4.298 1.84-5.006zm1.074.506a.376.376 0 00-.299.126C5.599 6.259 4.5 7.863 4.5 10c0 2.137 1.099 3.74 1.615 4.374.06.073.163.126.3.126h7.17c.137 0 .24-.053.3-.126.516-.633 1.615-2.237 1.615-4.374 0-2.137-1.099-3.74-1.615-4.374a.376.376 0 00-.3-.126h-7.17z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 7.5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V8a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path d="M9 12v1h2v-1a1 1 0 10-2 0z"/>');
var BIconPause = /*#__PURE__*/makeIcon('Pause', '<path fill-rule="evenodd" d="M8 5.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v8a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z" clip-rule="evenodd"/>');
var BIconPauseFill = /*#__PURE__*/makeIcon('PauseFill', '<path d="M7.5 5.5A1.5 1.5 0 019 7v6a1.5 1.5 0 01-3 0V7a1.5 1.5 0 011.5-1.5zm5 0A1.5 1.5 0 0114 7v6a1.5 1.5 0 01-3 0V7a1.5 1.5 0 011.5-1.5z"/>');
var BIconPen = /*#__PURE__*/makeIcon('Pen', '<path fill-rule="evenodd" d="M7.707 15.707a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391L12.086 4.5a2 2 0 012.828 0l.586.586a2 2 0 010 2.828l-7.793 7.793zM5 13l7.793-7.793a1 1 0 011.414 0l.586.586a1 1 0 010 1.414L7 15l-3 1 1-3z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.854 4.56a.5.5 0 00-.708 0L7.854 7.855a.5.5 0 11-.708-.708l3.293-3.292a1.5 1.5 0 012.122 0l.293.292a.5.5 0 11-.708.708l-.292-.293z" clip-rule="evenodd"/><path d="M15.293 3.207a1 1 0 011.414 0l.03.03a1 1 0 01.03 1.383L15.5 6 14 4.5l1.293-1.293z"/>');
var BIconPencil = /*#__PURE__*/makeIcon('Pencil', '<path fill-rule="evenodd" d="M13.293 3.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM14 4l2 2-9 9-3 1 1-3 9-9z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14.146 8.354l-2.5-2.5.708-.708 2.5 2.5-.708.708zM5 12v.5a.5.5 0 00.5.5H6v.5a.5.5 0 00.5.5H7v.5a.5.5 0 00.5.5H8v-1.5a.5.5 0 00-.5-.5H7v-.5a.5.5 0 00-.5-.5H5z" clip-rule="evenodd"/>');
var BIconPeople = /*#__PURE__*/makeIcon('People', '<path fill-rule="evenodd" d="M17 16s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.995-.944v-.002zM9.022 15h7.956a.274.274 0 00.014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C15.688 12.629 14.718 12 13 12c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 00.022.004zm7.973.056v-.002zM13 9a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zm-7.064 4.28a5.873 5.873 0 00-1.23-.247A7.334 7.334 0 007 11c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 017 15c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM6.92 12c-1.668.02-2.615.64-3.16 1.276C3.163 13.97 3 14.739 3 15h3c0-1.045.323-2.086.92-3zM3.5 7.5a3 3 0 116 0 3 3 0 01-6 0zm3-2a2 2 0 100 4 2 2 0 000-4z" clip-rule="evenodd"/>');
var BIconPeopleFill = /*#__PURE__*/makeIcon('PeopleFill', '<path fill-rule="evenodd" d="M9 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H9zm4-6a3 3 0 100-6 3 3 0 000 6zm-5.784 6A2.238 2.238 0 017 15c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 007 11c-4 0-5 3-5 4s1 1 1 1h4.216zM6.5 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/>');
var BIconPerson = /*#__PURE__*/makeIcon('Person', '<path fill-rule="evenodd" d="M15 16s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002zM5.022 15h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C13.516 12.68 12.289 12 10 12c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002zM10 9a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"/>');
var BIconPersonFill = /*#__PURE__*/makeIcon('PersonFill', '<path fill-rule="evenodd" d="M5 16s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H5zm5-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>');
var BIconPhone = /*#__PURE__*/makeIcon('Phone', '<path fill-rule="evenodd" d="M13 3H7a1 1 0 00-1 1v11a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM7 2a2 2 0 00-2 2v11a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>');
var BIconPhoneLandscape = /*#__PURE__*/makeIcon('PhoneLandscape', '<path fill-rule="evenodd" d="M3.5 6.5v6a1 1 0 001 1h11a1 1 0 001-1v-6a1 1 0 00-1-1h-11a1 1 0 00-1 1zm-1 6a2 2 0 002 2h11a2 2 0 002-2v-6a2 2 0 00-2-2h-11a2 2 0 00-2 2v6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M15.5 9.5a1 1 0 10-2 0 1 1 0 002 0z" clip-rule="evenodd"/>');
var BIconPieChart = /*#__PURE__*/makeIcon('PieChart', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.5 9.793V3h1v6.5H17v1h-6.793l-4.853 4.854-.708-.708L9.5 9.793z" clip-rule="evenodd"/>');
var BIconPieChartFill = /*#__PURE__*/makeIcon('PieChartFill', '<path d="M17.985 10.5h-7.778l-5.5 5.5a8 8 0 0013.277-5.5zM4 15.292A8 8 0 019.5 2.015v7.778l-5.5 5.5zm6.5-13.277V9.5h7.485A8.001 8.001 0 0010.5 2.015z"/>');
var BIconPlay = /*#__PURE__*/makeIcon('Play', '<path fill-rule="evenodd" d="M12.804 10L7 6.633v6.734L12.804 10zm.792-.696a.802.802 0 010 1.392l-6.363 3.692C6.713 14.69 6 14.345 6 13.692V6.308c0-.653.713-.998 1.233-.696l6.363 3.692z" clip-rule="evenodd"/>');
var BIconPlayFill = /*#__PURE__*/makeIcon('PlayFill', '<path d="M13.596 10.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V6.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>');
var BIconPlug = /*#__PURE__*/makeIcon('Plug', '<path d="M6 7h8v3a4 4 0 01-8 0V7z"/><path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v3a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v3a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zM9.115 15.651c.256-.511.385-1.408.385-2.651h1c0 1.257-.121 2.36-.49 3.099-.191.381-.47.707-.87.877-.401.17-.845.15-1.298-.002-.961-.32-1.534-.175-1.851.046-.33.23-.491.615-.491.98h-1c0-.635.278-1.353.918-1.8.653-.456 1.58-.561 2.74-.174.297.099.478.078.592.03.115-.05.244-.161.365-.405z" clip-rule="evenodd"/>');
var BIconPlus = /*#__PURE__*/makeIcon('Plus', '<path fill-rule="evenodd" d="M10 5.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h3.5V6a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.5 10a.5.5 0 01.5-.5h4a.5.5 0 010 1h-3.5V14a.5.5 0 01-1 0v-4z" clip-rule="evenodd"/>');
var BIconPower = /*#__PURE__*/makeIcon('Power', '<path fill-rule="evenodd" d="M7.578 6.437a5 5 0 104.922.044l.5-.865a6 6 0 11-5.908-.053l.486.874z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.5 10V3h1v7h-1z" clip-rule="evenodd"/>');
var BIconQuestion = /*#__PURE__*/makeIcon('Question', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm8-7a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/><path d="M7.25 8.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>');
var BIconQuestionFill = /*#__PURE__*/makeIcon('QuestionFill', '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.57 8.033H7.25C7.22 6.147 8.68 5.5 10.006 5.5c1.397 0 2.673.73 2.673 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.355H9.117l-.007-.463c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.901 0-1.358.603-1.358 1.384zm1.251 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" clip-rule="evenodd"/>');
var BIconQuestionSquare = /*#__PURE__*/makeIcon('QuestionSquare', '<path fill-rule="evenodd" d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path d="M7.25 8.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>');
var BIconQuestionSquareFill = /*#__PURE__*/makeIcon('QuestionSquareFill', '<path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm4.57 6.033H7.25C7.22 6.147 8.68 5.5 10.006 5.5c1.397 0 2.673.73 2.673 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.355H9.117l-.007-.463c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.901 0-1.358.603-1.358 1.384zm1.251 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" clip-rule="evenodd"/>');
var BIconReply = /*#__PURE__*/makeIcon('Reply', '<path fill-rule="evenodd" d="M11.502 7.013a.144.144 0 00-.202.134V8.3a.5.5 0 01-.5.5c-.667 0-2.013.005-3.3.822-.984.624-1.99 1.76-2.595 3.876 1.02-.983 2.185-1.516 3.205-1.799a8.745 8.745 0 011.921-.306 7.468 7.468 0 01.798.008h.013l.005.001h.001l-.048.498.05-.498a.5.5 0 01.45.498v1.153c0 .108.11.176.202.134l3.984-2.933a.522.522 0 01.042-.028.147.147 0 000-.252.51.51 0 01-.042-.028l-3.984-2.933zM10.3 12.386a7.745 7.745 0 00-1.923.277c-1.326.368-2.896 1.201-3.94 3.08a.5.5 0 01-.933-.305c.464-3.71 1.886-5.662 3.46-6.66 1.245-.79 2.527-.942 3.336-.971v-.66a1.144 1.144 0 011.767-.96l3.994 2.94a1.147 1.147 0 010 1.946l-3.994 2.94a1.144 1.144 0 01-1.767-.96v-.667z" clip-rule="evenodd"/>');
var BIconReplyAll = /*#__PURE__*/makeIcon('ReplyAll', '<path fill-rule="evenodd" d="M10.002 7.013a.144.144 0 00-.202.134V8.3a.5.5 0 01-.5.5c-.667 0-2.013.005-3.3.822-.984.624-1.99 1.76-2.595 3.876 1.02-.983 2.185-1.516 3.205-1.799a8.745 8.745 0 011.921-.306 7.47 7.47 0 01.798.008h.013l.005.001h.001L9.3 11.9l.05-.498a.5.5 0 01.45.498v1.153c0 .108.11.176.202.134l3.984-2.933a.522.522 0 01.042-.028.147.147 0 000-.252.51.51 0 01-.042-.028l-3.984-2.933zM8.8 12.386a7.745 7.745 0 00-1.923.277c-1.326.368-2.896 1.201-3.94 3.08a.5.5 0 01-.933-.305c.464-3.71 1.886-5.662 3.46-6.66 1.245-.79 2.527-.942 3.336-.971v-.66a1.144 1.144 0 011.767-.96l3.994 2.94a1.147 1.147 0 010 1.946l-3.994 2.94a1.144 1.144 0 01-1.767-.96v-.667z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.868 6.293a.5.5 0 01.7-.106l3.993 2.94a1.147 1.147 0 010 1.946l-3.994 2.94a.5.5 0 11-.593-.805l4.012-2.954a.523.523 0 01.042-.028.147.147 0 000-.252.512.512 0 01-.042-.028l-4.012-2.954a.5.5 0 01-.106-.699z" clip-rule="evenodd"/>');
var BIconReplyAllFill = /*#__PURE__*/makeIcon('ReplyAllFill', '<path d="M10.079 13.9l4.568-3.281a.719.719 0 000-1.238L10.079 6.1A.716.716 0 009 6.719V8c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/><path fill-rule="evenodd" d="M12.868 6.293a.5.5 0 01.7-.106l3.993 2.94a1.147 1.147 0 010 1.946l-3.994 2.94a.5.5 0 11-.593-.805l4.012-2.954a.523.523 0 01.042-.028.147.147 0 000-.252.512.512 0 01-.042-.028l-4.012-2.954a.5.5 0 01-.106-.699z" clip-rule="evenodd"/>');
var BIconReplyFill = /*#__PURE__*/makeIcon('ReplyFill', '<path d="M11.079 13.9l4.568-3.281a.719.719 0 000-1.238L11.079 6.1A.716.716 0 0010 6.719V8c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/>');
var BIconScrewdriver = /*#__PURE__*/makeIcon('Screwdriver', '<path fill-rule="evenodd" d="M2 3l1-1 3.081 2.2a1 1 0 01.419.815v.07a1 1 0 00.293.708L12.5 11.5l.914-.305a1 1 0 011.023.242l3.356 3.356a1 1 0 010 1.414l-1.586 1.586a1 1 0 01-1.414 0l-3.356-3.356a1 1 0 01-.242-1.023l.305-.914-5.707-5.707a1 1 0 00-.707-.293h-.071a1 1 0 01-.814-.419L2 3zm11.354 9.646a.5.5 0 00-.708.708l3 3a.5.5 0 00.708-.708l-3-3z" clip-rule="evenodd"/>');
var BIconSearch = /*#__PURE__*/makeIcon('Search', '<path fill-rule="evenodd" d="M12.442 12.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8.5 14a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM15 8.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" clip-rule="evenodd"/>');
var BIconShield = /*#__PURE__*/makeIcon('Shield', '<path fill-rule="evenodd" d="M7.443 3.991a60.17 60.17 0 00-2.725.802.454.454 0 00-.315.366C3.87 9.056 5.1 11.9 6.567 13.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0010 16.5a.774.774 0 00.097-.023c.072-.022.166-.058.282-.111.23-.106.524-.272.857-.5a10.198 10.198 0 002.197-2.093C14.9 11.9 16.13 9.056 15.597 5.159a.454.454 0 00-.315-.366c-.626-.2-1.682-.526-2.725-.802C11.491 3.71 10.51 3.5 10 3.5c-.51 0-1.49.21-2.557.491zm-.256-.966C8.23 2.749 9.337 2.5 10 2.5c.662 0 1.77.249 2.813.525 1.066.282 2.14.614 2.772.815.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.192 11.192 0 01-2.418 2.3 6.942 6.942 0 01-1.007.586c-.27.124-.558.225-.796.225s-.527-.101-.796-.225a6.908 6.908 0 01-1.007-.586 11.192 11.192 0 01-2.418-2.3c-1.611-2.058-2.94-5.168-2.367-9.365A1.454 1.454 0 014.415 3.84a61.113 61.113 0 012.772-.815z" clip-rule="evenodd"/>');
var BIconShieldFill = /*#__PURE__*/makeIcon('ShieldFill', '<path fill-rule="evenodd" d="M7.187 3.025C8.23 2.749 9.337 2.5 10 2.5c.662 0 1.77.249 2.813.525 1.066.282 2.14.614 2.772.815.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.192 11.192 0 01-2.418 2.3 6.942 6.942 0 01-1.007.586c-.27.124-.558.225-.796.225s-.527-.101-.796-.225a6.908 6.908 0 01-1.007-.586 11.192 11.192 0 01-2.418-2.3c-1.611-2.058-2.94-5.168-2.367-9.365A1.454 1.454 0 014.415 3.84a61.113 61.113 0 012.772-.815z" clip-rule="evenodd"/>');
var BIconShieldLock = /*#__PURE__*/makeIcon('ShieldLock', '<path fill-rule="evenodd" d="M7.443 3.991a60.17 60.17 0 00-2.725.802.454.454 0 00-.315.366C3.87 9.056 5.1 11.9 6.567 13.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0010 16.5a.774.774 0 00.097-.023c.072-.022.166-.058.282-.111.23-.106.524-.272.857-.5a10.198 10.198 0 002.197-2.093C14.9 11.9 16.13 9.056 15.597 5.159a.454.454 0 00-.315-.366c-.626-.2-1.682-.526-2.725-.802C11.491 3.71 10.51 3.5 10 3.5c-.51 0-1.49.21-2.557.491zm-.256-.966C8.23 2.749 9.337 2.5 10 2.5c.662 0 1.77.249 2.813.525 1.066.282 2.14.614 2.772.815.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.192 11.192 0 01-2.418 2.3 6.942 6.942 0 01-1.007.586c-.27.124-.558.225-.796.225s-.527-.101-.796-.225a6.908 6.908 0 01-1.007-.586 11.192 11.192 0 01-2.418-2.3c-1.611-2.058-2.94-5.168-2.367-9.365A1.454 1.454 0 014.415 3.84a61.113 61.113 0 012.772-.815z" clip-rule="evenodd"/><path d="M11.5 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M9.41 10.034a.5.5 0 01.494-.417h.156a.5.5 0 01.492.414l.347 2a.5.5 0 01-.493.585h-.835a.5.5 0 01-.493-.582l.333-2z"/>');
var BIconShieldLockFill = /*#__PURE__*/makeIcon('ShieldLockFill', '<path fill-rule="evenodd" d="M7.187 3.025C8.23 2.749 9.337 2.5 10 2.5c.662 0 1.77.249 2.813.525a61.1 61.1 0 012.772.815c.527.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.368 9.365a11.19 11.19 0 01-2.417 2.3 6.942 6.942 0 01-1.007.586c-.27.124-.558.225-.796.225s-.527-.101-.796-.225a6.908 6.908 0 01-1.007-.586 11.192 11.192 0 01-2.418-2.3c-1.611-2.058-2.94-5.168-2.367-9.365A1.454 1.454 0 014.415 3.84a61.105 61.105 0 012.772-.815zm3.328 6.884a1.5 1.5 0 10-1.06-.011.5.5 0 00-.044.136l-.333 2a.5.5 0 00.493.582h.835a.5.5 0 00.493-.585l-.347-2a.501.501 0 00-.037-.122z" clip-rule="evenodd"/>');
var BIconShieldShaded = /*#__PURE__*/makeIcon('ShieldShaded', '<path fill-rule="evenodd" d="M7.443 3.991a60.17 60.17 0 00-2.725.802.454.454 0 00-.315.366C3.87 9.056 5.1 11.9 6.567 13.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0010 16.5a.774.774 0 00.097-.023c.072-.022.166-.058.282-.111a5.94 5.94 0 00.857-.5 10.198 10.198 0 002.197-2.093C14.9 11.9 16.13 9.056 15.597 5.159a.454.454 0 00-.315-.366c-.626-.2-1.682-.526-2.725-.802C11.491 3.71 10.51 3.5 10 3.5c-.51 0-1.49.21-2.557.491zm-.256-.966C8.23 2.749 9.337 2.5 10 2.5c.662 0 1.77.249 2.813.525 1.066.282 2.14.614 2.772.815.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.192 11.192 0 01-2.418 2.3 6.942 6.942 0 01-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 01-1.007-.586 11.192 11.192 0 01-2.418-2.3c-1.611-2.058-2.94-5.168-2.367-9.365A1.454 1.454 0 014.415 3.84a61.105 61.105 0 012.772-.815z" clip-rule="evenodd"/><path d="M10 4.25c.909 0 3.188.685 4.254 1.022a.94.94 0 01.656.773c.814 6.424-4.13 9.452-4.91 9.452V4.25z"/>');
var BIconShift = /*#__PURE__*/makeIcon('Shift', '<path fill-rule="evenodd" d="M9.27 4.047a1 1 0 011.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H13.5v3a1 1 0 01-1 1h-5a1 1 0 01-1-1v-3H3.654c-.875 0-1.328-1.045-.73-1.684L9.27 4.047zm7.076 7.453L10 4.731 3.654 11.5H6.5a1 1 0 011 1v3h5v-3a1 1 0 011-1h2.846z" clip-rule="evenodd"/>');
var BIconShiftFill = /*#__PURE__*/makeIcon('ShiftFill', '<path fill-rule="evenodd" d="M9.27 4.047a1 1 0 011.46 0l6.345 6.769c.6.639.146 1.684-.73 1.684H13.5v3a1 1 0 01-1 1h-5a1 1 0 01-1-1v-3H3.654c-.875 0-1.328-1.045-.73-1.684L9.27 4.047z" clip-rule="evenodd"/>');
var BIconSkipBackward = /*#__PURE__*/makeIcon('SkipBackward', '<path fill-rule="evenodd" d="M2.5 5.5A.5.5 0 013 6v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v2.94l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L10.5 10.752v2.94c0 .653-.713.998-1.233.696L3 10.752V14a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm7 1.133L3.696 10 9.5 13.367V6.633zm7.5 0L11.196 10 17 13.367V6.633z" clip-rule="evenodd"/>');
var BIconSkipBackwardFill = /*#__PURE__*/makeIcon('SkipBackwardFill', '<path stroke="currentColor" stroke-linecap="round" d="M14 6v8"/><path d="M13.596 10.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V6.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>');
var BIconSkipEnd = /*#__PURE__*/makeIcon('SkipEnd', '<path fill-rule="evenodd" d="M14 5.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.804 10L7 6.633v6.734L12.804 10zm.792-.696a.802.802 0 010 1.392l-6.363 3.692C6.713 14.69 6 14.345 6 13.692V6.308c0-.653.713-.998 1.233-.696l6.363 3.692z" clip-rule="evenodd"/>');
var BIconSkipEndFill = /*#__PURE__*/makeIcon('SkipEndFill', '<path stroke="currentColor" stroke-linecap="round" d="M2.5 6v8"/><path d="M2.904 10.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V6.308c0-.63-.693-1.01-1.233-.696L2.904 9.304a.802.802 0 000 1.393z"/><path d="M10.404 10.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V6.308c0-.63-.692-1.01-1.233-.696l-6.363 3.692a.802.802 0 000 1.393z"/>');
var BIconSkipForward = /*#__PURE__*/makeIcon('SkipForward', '<path fill-rule="evenodd" d="M17.5 5.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-3.248l-6.267 3.636c-.52.302-1.233-.043-1.233-.696v-2.94l-6.267 3.636C2.713 14.69 2 14.345 2 13.692V6.308c0-.653.713-.998 1.233-.696L9.5 9.248v-2.94c0-.653.713-.998 1.233-.696L17 9.248V6a.5.5 0 01.5-.5zM3 6.633v6.734L8.804 10 3 6.633zm7.5 0v6.734L16.304 10 10.5 6.633z" clip-rule="evenodd"/>');
var BIconSkipForwardFill = /*#__PURE__*/makeIcon('SkipForwardFill', '<path stroke="currentColor" stroke-linecap="round" d="M17.5 6v8"/><path d="M9.596 10.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V6.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/><path d="M17.096 10.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V6.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>');
var BIconSkipStart = /*#__PURE__*/makeIcon('SkipStart', '<path fill-rule="evenodd" d="M6.5 5.5A.5.5 0 006 6v8a.5.5 0 001 0V6a.5.5 0 00-.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.696 10L13.5 6.633v6.734L7.696 10zm-.792-.696a.802.802 0 000 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V6.308c0-.653-.713-.998-1.233-.696L6.904 9.304z" clip-rule="evenodd"/>');
var BIconSkipStartFill = /*#__PURE__*/makeIcon('SkipStartFill', '<path stroke="currentColor" stroke-linecap="round" d="M6.5 6v8"/><path d="M6.903 10.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V6.308c0-.63-.692-1.01-1.232-.696L6.903 9.304a.802.802 0 000 1.393z"/>');
var BIconSpeaker = /*#__PURE__*/makeIcon('Speaker', '<path d="M11 6a1 1 0 11-2 0 1 1 0 012 0zm-2.5 6.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"/><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm6 4a2 2 0 11-4 0 2 2 0 014 0zm-2 3a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" clip-rule="evenodd"/>');
var BIconSquare = /*#__PURE__*/makeIcon('Square', '<path fill-rule="evenodd" d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>');
var BIconSquareFill = /*#__PURE__*/makeIcon('SquareFill', '<rect width="16" height="16" x="2" y="2" rx="2"/>');
var BIconSquareHalf = /*#__PURE__*/makeIcon('SquareHalf', '<path fill-rule="evenodd" d="M10 3H4a1 1 0 00-1 1v12a1 1 0 001 1h6V3zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/>');
var BIconStar = /*#__PURE__*/makeIcon('Star', '<path fill-rule="evenodd" d="M4.866 16.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696-2.184-4.327a.513.513 0 00-.927 0L7.354 7.12l-4.898.696c-.441.062-.612.636-.282.95l3.522 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 00-.163-.505L3.71 8.745l4.052-.576a.525.525 0 00.393-.288l1.847-3.658 1.846 3.658c.08.157.226.264.393.288l4.053.575-2.907 2.77a.564.564 0 00-.163.506l.694 3.957-3.686-1.894a.503.503 0 00-.461 0z" clip-rule="evenodd"/>');
var BIconStarFill = /*#__PURE__*/makeIcon('StarFill', '<path d="M5.612 17.443c-.386.198-.824-.149-.746-.592l.83-4.73-3.522-3.356c-.33-.314-.16-.888.282-.95l4.898-.696 2.184-4.327c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L10 15.187l-4.389 2.256z"/>');
var BIconStarHalf = /*#__PURE__*/makeIcon('StarHalf', '<path fill-rule="evenodd" d="M7.354 7.119l2.184-4.327A.516.516 0 0110 2.5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0118 8.32a.55.55 0 01-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L10 15.187l-4.389 2.256a.52.52 0 01-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73-3.522-3.356a.55.55 0 01-.172-.403.59.59 0 01.084-.302.513.513 0 01.37-.245l4.898-.696zM10 14.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 01.163-.505l2.907-2.77-4.053-.576a.525.525 0 01-.393-.288l-1.847-3.658-.001.003v9.8z" clip-rule="evenodd"/>');
var BIconStop = /*#__PURE__*/makeIcon('Stop', '<path fill-rule="evenodd" d="M5.5 7A1.5 1.5 0 017 5.5h6A1.5 1.5 0 0114.5 7v6a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 13V7zM7 6.5a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h6a.5.5 0 00.5-.5V7a.5.5 0 00-.5-.5H7z" clip-rule="evenodd"/>');
var BIconStopFill = /*#__PURE__*/makeIcon('StopFill', '<path d="M7 5.5h6A1.5 1.5 0 0114.5 7v6a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 13V7A1.5 1.5 0 017 5.5z"/>');
var BIconStopwatch = /*#__PURE__*/makeIcon('Stopwatch', '<path fill-rule="evenodd" d="M10 17a6 6 0 100-12 6 6 0 000 12zm0 1a7 7 0 100-14 7 7 0 000 14z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 6.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6.5a.5.5 0 010-1h3V7a.5.5 0 01.5-.5zm-2.5-4A.5.5 0 018 2h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5z" clip-rule="evenodd"/><path d="M9 3h2v2H9V3z"/>');
var BIconStopwatchFill = /*#__PURE__*/makeIcon('StopwatchFill', '<path fill-rule="evenodd" d="M7.5 2.5A.5.5 0 018 2h4a.5.5 0 010 1h-1v1.07A7.002 7.002 0 0110 18 7 7 0 019 4.07V3H8a.5.5 0 01-.5-.5zm3 4.5a.5.5 0 00-1 0v3.5h-3a.5.5 0 000 1H10a.5.5 0 00.5-.5V7z" clip-rule="evenodd"/>');
var BIconSun = /*#__PURE__*/makeIcon('Sun', '<path d="M5.5 10a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/><path fill-rule="evenodd" d="M10.202 2.28a.25.25 0 00-.404 0l-.91 1.255a.25.25 0 01-.334.067L7.232 2.79a.25.25 0 00-.374.155l-.36 1.508a.25.25 0 01-.282.189l-1.532-.244a.25.25 0 00-.286.286l.244 1.532a.25.25 0 01-.189.282l-1.508.36a.25.25 0 00-.155.374l.812 1.322a.25.25 0 01-.067.333l-1.256.91a.25.25 0 000 .405l1.256.91a.25.25 0 01.067.334l-.812 1.322a.25.25 0 00.155.374l1.508.36a.25.25 0 01.19.282l-.245 1.532a.25.25 0 00.286.286l1.532-.244a.25.25 0 01.282.189l.36 1.508a.25.25 0 00.374.155l1.322-.812a.25.25 0 01.333.067l.91 1.256a.25.25 0 00.405 0l.91-1.256a.25.25 0 01.334-.067l1.322.812a.25.25 0 00.374-.155l.36-1.508a.25.25 0 01.282-.19l1.532.245a.25.25 0 00.286-.286l-.244-1.532a.25.25 0 01.189-.282l1.508-.36a.25.25 0 00.155-.374l-.812-1.322a.25.25 0 01.067-.333l1.256-.91a.25.25 0 000-.405l-1.256-.91a.25.25 0 01-.067-.334l.812-1.322a.25.25 0 00-.155-.374l-1.508-.36a.25.25 0 01-.19-.282l.245-1.532a.25.25 0 00-.286-.286l-1.532.244a.25.25 0 01-.282-.189l-.36-1.509a.25.25 0 00-.374-.154l-1.322.812a.25.25 0 01-.333-.067l-.91-1.256zM10 4.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clip-rule="evenodd"/>');
var BIconTable = /*#__PURE__*/makeIcon('Table', '<path fill-rule="evenodd" d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M17 6H3V5h14v1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7 17.5v-14h1v14H7zm5 0v-14h1v14h-1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M17 10H3V9h14v1zm0 4H3v-1h14v1z" clip-rule="evenodd"/><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v2H2V4z"/>');
var BIconTablet = /*#__PURE__*/makeIcon('Tablet', '<path fill-rule="evenodd" d="M14 3.5H6a1 1 0 00-1 1v11a1 1 0 001 1h8a1 1 0 001-1v-11a1 1 0 00-1-1zm-8-1a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2v-11a2 2 0 00-2-2H6z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 15.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>');
var BIconTabletLandscape = /*#__PURE__*/makeIcon('TabletLandscape', '<path fill-rule="evenodd" d="M3.5 6v8a1 1 0 001 1h11a1 1 0 001-1V6a1 1 0 00-1-1h-11a1 1 0 00-1 1zm-1 8a2 2 0 002 2h11a2 2 0 002-2V6a2 2 0 00-2-2h-11a2 2 0 00-2 2v8z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M15.5 10a1 1 0 10-2 0 1 1 0 002 0z" clip-rule="evenodd"/>');
var BIconTag = /*#__PURE__*/makeIcon('Tag', '<path fill-rule="evenodd" d="M2.5 4A1.5 1.5 0 014 2.5h4.586a1.5 1.5 0 011.06.44l7 7a1.5 1.5 0 010 2.12l-4.585 4.586a1.5 1.5 0 01-2.122 0l-7-7a1.5 1.5 0 01-.439-1.06V4zM4 3.5a.5.5 0 00-.5.5v4.586a.5.5 0 00.146.353l7 7a.5.5 0 00.708 0l4.585-4.585a.5.5 0 000-.708l-7-7a.5.5 0 00-.353-.146H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M4.5 6.5a2 2 0 114 0 2 2 0 01-4 0zm2-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/>');
var BIconTagFill = /*#__PURE__*/makeIcon('TagFill', '<path fill-rule="evenodd" d="M4 3a1 1 0 00-1 1v4.586a1 1 0 00.293.707l7 7a1 1 0 001.414 0l4.586-4.586a1 1 0 000-1.414l-7-7A1 1 0 008.586 3H4zm4 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clip-rule="evenodd"/>');
var BIconTerminal = /*#__PURE__*/makeIcon('Terminal', '<path fill-rule="evenodd" d="M16 4H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M8 11a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3A.5.5 0 018 11zM5.146 6.146a.5.5 0 01.708 0l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L6.793 8.5 5.146 6.854a.5.5 0 010-.708z" clip-rule="evenodd"/>');
var BIconTerminalFill = /*#__PURE__*/makeIcon('TerminalFill', '<path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm9.5 5.5h-3a.5.5 0 000 1h3a.5.5 0 000-1zm-6.354-.354L6.793 8.5 5.146 6.854a.5.5 0 11.708-.708l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708z" clip-rule="evenodd"/>');
var BIconTextCenter = /*#__PURE__*/makeIcon('TextCenter', '<path fill-rule="evenodd" d="M6 14.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm2-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconTextIndentLeft = /*#__PURE__*/makeIcon('TextIndentLeft', '<path fill-rule="evenodd" d="M4 5.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm.646 2.146a.5.5 0 01.708 0l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L6.293 10 4.646 8.354a.5.5 0 010-.708zM9 8.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm-5 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconTextIndentRight = /*#__PURE__*/makeIcon('TextIndentRight', '<path fill-rule="evenodd" d="M4 5.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm10.646 2.146a.5.5 0 01.708.708L13.707 10l1.647 1.646a.5.5 0 01-.708.708l-2-2a.5.5 0 010-.708l2-2zM4 8.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconTextLeft = /*#__PURE__*/makeIcon('TextLeft', '<path fill-rule="evenodd" d="M4 14.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconTextRight = /*#__PURE__*/makeIcon('TextRight', '<path stroke="currentColor" stroke-linecap="round" d="M8.5 14.5h7m-11-3h11m-7-3h7m-11-3h11"/>');
var BIconThreeDots = /*#__PURE__*/makeIcon('ThreeDots', '<path fill-rule="evenodd" d="M5 11.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd"/>');
var BIconThreeDotsVertical = /*#__PURE__*/makeIcon('ThreeDotsVertical', '<path fill-rule="evenodd" d="M11.5 15a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clip-rule="evenodd"/>');
var BIconToggleOff = /*#__PURE__*/makeIcon('ToggleOff', '<path fill-rule="evenodd" d="M13 6a4 4 0 010 8h-3a4.992 4.992 0 002-4 4.992 4.992 0 00-2-4h3zm-6 8a4 4 0 110-8 4 4 0 010 8zm-5-4a5 5 0 005 5h6a5 5 0 000-10H7a5 5 0 00-5 5z" clip-rule="evenodd"/>');
var BIconToggleOn = /*#__PURE__*/makeIcon('ToggleOn', '<path fill-rule="evenodd" d="M7 5a5 5 0 000 10h6a5 5 0 000-10H7zm6 9a4 4 0 100-8 4 4 0 000 8z" clip-rule="evenodd"/>');
var BIconToggles = /*#__PURE__*/makeIcon('Toggles', '<path fill-rule="evenodd" d="M13.5 3h-7a2.5 2.5 0 000 5h7a2.5 2.5 0 000-5zm-7-1a3.5 3.5 0 100 7h7a3.5 3.5 0 100-7h-7zm0 9a3.5 3.5 0 100 7h7a3.5 3.5 0 100-7h-7zm7 6a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 5.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM6.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clip-rule="evenodd"/>');
var BIconTools = /*#__PURE__*/makeIcon('Tools', '<path fill-rule="evenodd" d="M2 3l1-1 3.081 2.2a1 1 0 01.419.815v.07a1 1 0 00.293.708L12.5 11.5l.914-.305a1 1 0 011.023.242l3.356 3.356a1 1 0 010 1.414l-1.586 1.586a1 1 0 01-1.414 0l-3.356-3.356a1 1 0 01-.242-1.023l.305-.914-5.707-5.707a1 1 0 00-.707-.293h-.071a1 1 0 01-.814-.419L2 3zm11.354 9.646a.5.5 0 00-.708.708l3 3a.5.5 0 00.708-.708l-3-3z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M17.898 4.223a3.003 3.003 0 01-3.679 3.674L7.878 14.15a3 3 0 11-2.027-2.027l6.252-6.341a3 3 0 013.675-3.68l-2.142 2.142L14 6l1.757.364 2.141-2.141zm-13.37 9.019L5 13l.471.242.529.026.287.445.445.287.026.529L7 15l-.242.471-.026.529-.445.287-.287.445-.529.026L5 17l-.471-.242L4 16.732l-.287-.445L3.268 16l-.026-.529L3 15l.242-.471.026-.529.445-.287.287-.445.529-.026z" clip-rule="evenodd"/>');
var BIconTrash = /*#__PURE__*/makeIcon('Trash', '<path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"/><path fill-rule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clip-rule="evenodd"/>');
var BIconTrashFill = /*#__PURE__*/makeIcon('TrashFill', '<path fill-rule="evenodd" d="M4.5 3a1 1 0 00-1 1v1a1 1 0 001 1H5v9a2 2 0 002 2h6a2 2 0 002-2V6h.5a1 1 0 001-1V4a1 1 0 00-1-1H12a1 1 0 00-1-1H9a1 1 0 00-1 1H4.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM10 7a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 0110 7zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>');
var BIconTriangle = /*#__PURE__*/makeIcon('Triangle', '<path fill-rule="evenodd" d="M9.938 4.016a.146.146 0 00-.054.057L3.027 15.74a.176.176 0 00-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 00.066-.017.163.163 0 00.055-.06.176.176 0 00-.003-.183L10.12 4.073a.146.146 0 00-.054-.057.13.13 0 00-.063-.016.13.13 0 00-.064.016zm1.043-.45a1.13 1.13 0 00-1.96 0L2.166 15.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L10.982 3.566z" clip-rule="evenodd"/>');
var BIconTriangleFill = /*#__PURE__*/makeIcon('TriangleFill', '<path fill-rule="evenodd" d="M9.022 3.566a1.13 1.13 0 011.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H3.144c-.889 0-1.437-.99-.98-1.767L9.022 3.566z" clip-rule="evenodd"/>');
var BIconTriangleHalf = /*#__PURE__*/makeIcon('TriangleHalf', '<path fill-rule="evenodd" d="M9.938 4.016a.146.146 0 00-.054.057L3.027 15.74a.176.176 0 00-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017l6.857-.017V4a.13.13 0 00-.064.016zm1.043-.45a1.13 1.13 0 00-1.96 0L2.166 15.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L10.982 3.566z" clip-rule="evenodd"/>');
var BIconTrophy = /*#__PURE__*/makeIcon('Trophy', '<path d="M5 3h10c-.495 3.467-.5 10-5 10S5.495 6.467 5 3zm0 15a1 1 0 011-1h8a1 1 0 011 1H5zm2-1a1 1 0 011-1h4a1 1 0 011 1H7z"/><path fill-rule="evenodd" d="M14.5 5a2 2 0 100 4 2 2 0 000-4zm-3 2a3 3 0 116 0 3 3 0 01-6 0zm-6-2a2 2 0 100 4 2 2 0 000-4zm-3 2a3 3 0 116 0 3 3 0 01-6 0z" clip-rule="evenodd"/><path d="M9 12h2v4H9v-4z"/><path d="M12 13c0 .552-.895 1-2 1s-2-.448-2-1 .895-1 2-1 2 .448 2 1z"/>');
var BIconTv = /*#__PURE__*/makeIcon('Tv', '<path fill-rule="evenodd" d="M2.216 6H1.5v-.04l.005-.083a2.957 2.957 0 01.298-1.102c.154-.309.394-.633.763-.88C2.94 3.648 3.413 3.5 4 3.5h12.039l.083.005a2.958 2.958 0 011.102.298c.309.154.633.394.88.763.248.373.396.847.396 1.434v6H18h.5v.039l-.005.083a2.957 2.957 0 01-.298 1.102 2.257 2.257 0 01-.763.88c-.373.248-.847.396-1.434.396H3.961l-.083-.005a2.956 2.956 0 01-1.102-.298 2.254 2.254 0 01-.88-.763C1.648 13.06 1.5 12.588 1.5 12V6h.716zm.284.002v-.008l.003-.044a1.959 1.959 0 01.195-.726c.095-.191.23-.367.423-.495.19-.127.466-.229.879-.229h12.006l.044.003a1.958 1.958 0 01.726.195c.191.095.367.23.495.423.127.19.229.466.229.879v6.006l-.003.044a1.959 1.959 0 01-.195.726c-.095.191-.23.367-.423.495-.19.127-.466.229-.879.229H3.994l-.044-.003a1.96 1.96 0 01-.726-.195 1.256 1.256 0 01-.495-.423c-.127-.19-.229-.466-.229-.879V6.002zM4.003 13.5zm.497 2A.5.5 0 015 15h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>');
var BIconTvFill = /*#__PURE__*/makeIcon('TvFill', '<path fill-rule="evenodd" d="M4.5 15.5A.5.5 0 015 15h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM4 4h12s2 0 2 2v6s0 2-2 2H4s-2 0-2-2V6s0-2 2-2z" clip-rule="evenodd"/>');
var BIconType = /*#__PURE__*/makeIcon('Type', '<path d="M4.244 15.081l.944-2.803H8.66l.944 2.803h1.257L7.54 5.75H6.322L3 15.081h1.244zm2.7-7.923l1.395 4.157h-2.83L6.91 7.158h.034zm9.146 7.027h.035v.896h1.128v-4.956c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.463v.732H14.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>');
var BIconTypeBold = /*#__PURE__*/makeIcon('TypeBold', '<path d="M10.21 15c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 001.852-2.14c0-1.51-1.162-2.46-3.014-2.46H5.843V15h4.368zM7.908 6.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H7.908V6.673zm0 6.788v-2.864h1.73c1.216 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H7.907z"/>');
var BIconTypeH1 = /*#__PURE__*/makeIcon('TypeH1', '<path d="M10.637 15V5.669H9.379V9.62H4.758V5.67H3.5V15h1.258v-4.273h4.62V15h1.259zm5.329 0V5.669h-1.244L12.5 7.316v1.265l2.16-1.565h.062V15h1.244z"/>');
var BIconTypeH2 = /*#__PURE__*/makeIcon('TypeH2', '<path d="M9.638 15V5.669H8.38V9.62H3.759V5.67H2.5V15h1.258v-4.273h4.62V15h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V15H17.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"/>');
var BIconTypeH3 = /*#__PURE__*/makeIcon('TypeH3', '<path d="M9.637 15V5.669H8.379V9.62H3.758V5.67H2.5V15h1.258v-4.273h4.62V15h1.259zm3.625-4.273h1.018c1.142 0 1.935.67 1.949 1.675.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32h-1.176c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.073z"/>');
var BIconTypeItalic = /*#__PURE__*/makeIcon('TypeItalic', '<path d="M9.991 13.674l1.538-7.219c.123-.595.246-.71 1.347-.807l.11-.52H9.211l-.11.52c1.06.096 1.128.212 1.005.807L8.57 13.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>');
var BIconTypeStrikethrough = /*#__PURE__*/makeIcon('TypeStrikethrough', '<path d="M10.527 15.164c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675l-.946-.207h3.45c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967zM8.602 8.5H7.167a2.776 2.776 0 01-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607 0 .31.083.581.27.814z"/><path fill-rule="evenodd" d="M17 10.5H3v-1h14v1z" clip-rule="evenodd"/>');
var BIconTypeUnderline = /*#__PURE__*/makeIcon('TypeUnderline', '<path d="M7.313 5.136h-1.23v6.405c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V5.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V5.136z"/><path fill-rule="evenodd" d="M14.5 17h-9v-1h9v1z" clip-rule="evenodd"/>');
var BIconUnlock = /*#__PURE__*/makeIcon('Unlock', '<path fill-rule="evenodd" d="M11.655 9H4.333c-.264 0-.398.068-.471.121a.73.73 0 00-.224.296 1.626 1.626 0 00-.138.59V15c0 .342.076.531.14.635.064.106.151.18.256.237a1.122 1.122 0 00.436.127l.013.001h7.322c.264 0 .398-.068.471-.121a.73.73 0 00.224-.296 1.627 1.627 0 00.138-.59V10c0-.342-.076-.531-.14-.635a.658.658 0 00-.255-.237 1.123 1.123 0 00-.45-.128zm.012-1H4.333C2.5 8 2.5 10 2.5 10v5c0 2 1.833 2 1.833 2h7.334c1.833 0 1.833-2 1.833-2v-5c0-2-1.833-2-1.833-2zM10.5 5a3.5 3.5 0 117 0v3h-1V5a2.5 2.5 0 00-5 0v3h-1V5z" clip-rule="evenodd"/>');
var BIconUnlockFill = /*#__PURE__*/makeIcon('UnlockFill', '<path d="M2.5 10a2 2 0 012-2h7a2 2 0 012 2v5a2 2 0 01-2 2h-7a2 2 0 01-2-2v-5z"/><path fill-rule="evenodd" d="M10.5 5a3.5 3.5 0 117 0v3h-1V5a2.5 2.5 0 00-5 0v3h-1V5z" clip-rule="evenodd"/>');
var BIconUpload = /*#__PURE__*/makeIcon('Upload', '<path fill-rule="evenodd" d="M2.5 10a.5.5 0 01.5.5V14a1 1 0 001 1h12a1 1 0 001-1v-3.5a.5.5 0 011 0V14a2 2 0 01-2 2H4a2 2 0 01-2-2v-3.5a.5.5 0 01.5-.5zM7 6.854a.5.5 0 00.707 0L10 4.56l2.293 2.293A.5.5 0 1013 6.146L10.354 3.5a.5.5 0 00-.708 0L7 6.146a.5.5 0 000 .708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 4a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 0110 4z" clip-rule="evenodd"/>');
var BIconVolumeDown = /*#__PURE__*/makeIcon('VolumeDown', '<path fill-rule="evenodd" d="M10.717 5.55A.5.5 0 0111 6v8a.5.5 0 01-.812.39L7.825 12.5H5.5A.5.5 0 015 12V8a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06zM10 7.04L8.312 8.39A.5.5 0 018 8.5H6v3h2a.5.5 0 01.312.11L10 12.96V7.04z" clip-rule="evenodd"/><path d="M12.707 13.182A4.486 4.486 0 0014.025 10a4.486 4.486 0 00-1.318-3.182L12 7.525A3.489 3.489 0 0113.025 10c0 .966-.392 1.841-1.025 2.475l.707.707z"/>');
var BIconVolumeDownFill = /*#__PURE__*/makeIcon('VolumeDownFill', '<path fill-rule="evenodd" d="M10.717 5.55A.5.5 0 0111 6v8a.5.5 0 01-.812.39L7.825 12.5H5.5A.5.5 0 015 12V8a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06z" clip-rule="evenodd"/><path d="M12.707 13.182A4.486 4.486 0 0014.025 10a4.486 4.486 0 00-1.318-3.182L12 7.525A3.489 3.489 0 0113.025 10c0 .966-.392 1.841-1.025 2.475l.707.707z"/>');
var BIconVolumeMute = /*#__PURE__*/makeIcon('VolumeMute', '<path fill-rule="evenodd" d="M8.717 5.55A.5.5 0 019 6v8a.5.5 0 01-.812.39L5.825 12.5H3.5A.5.5 0 013 12V8a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06zM8 7.04L6.312 8.39A.5.5 0 016 8.5H4v3h2a.5.5 0 01.312.11L8 12.96V7.04zm7.854.606a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708l4-4a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.146 7.646a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0z" clip-rule="evenodd"/>');
var BIconVolumeMuteFill = /*#__PURE__*/makeIcon('VolumeMuteFill', '<path fill-rule="evenodd" d="M8.717 5.55A.5.5 0 019 6v8a.5.5 0 01-.812.39L5.825 12.5H3.5A.5.5 0 013 12V8a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06zm7.137 1.596a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708l4-4a.5.5 0 01.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.146 7.146a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0z" clip-rule="evenodd"/>');
var BIconVolumeUp = /*#__PURE__*/makeIcon('VolumeUp', '<path fill-rule="evenodd" d="M8.717 5.55A.5.5 0 019 6v8a.5.5 0 01-.812.39L5.825 12.5H3.5A.5.5 0 013 12V8a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06zM8 7.04L6.312 8.39A.5.5 0 016 8.5H4v3h2a.5.5 0 01.312.11L8 12.96V7.04z" clip-rule="evenodd"/><path d="M13.536 16.01a8.473 8.473 0 002.49-6.01 8.473 8.473 0 00-2.49-6.01l-.708.707A7.476 7.476 0 0115.025 10c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M12.121 14.596A6.48 6.48 0 0014.025 10a6.48 6.48 0 00-1.904-4.596l-.707.707A5.483 5.483 0 0113.025 10a5.483 5.483 0 01-1.61 3.89l.706.706z"/><path d="M10.707 13.182A4.486 4.486 0 0012.025 10a4.486 4.486 0 00-1.318-3.182L10 7.525A3.489 3.489 0 0111.025 10c0 .966-.392 1.841-1.025 2.475l.707.707z"/>');
var BIconVolumeUpFill = /*#__PURE__*/makeIcon('VolumeUpFill', '<path d="M13.536 16.01a8.473 8.473 0 002.49-6.01 8.473 8.473 0 00-2.49-6.01l-.708.707A7.476 7.476 0 0115.025 10c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M12.121 14.596A6.48 6.48 0 0014.025 10a6.48 6.48 0 00-1.904-4.596l-.707.707A5.483 5.483 0 0113.025 10a5.483 5.483 0 01-1.61 3.89l.706.706z"/><path d="M10.707 13.182A4.486 4.486 0 0012.025 10a4.486 4.486 0 00-1.318-3.182L10 7.525A3.489 3.489 0 0111.025 10c0 .966-.392 1.841-1.025 2.475l.707.707z"/><path fill-rule="evenodd" d="M8.717 5.55A.5.5 0 019 6v8a.5.5 0 01-.812.39L5.825 12.5H3.5A.5.5 0 013 12V8a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06z" clip-rule="evenodd"/>');
var BIconWallet = /*#__PURE__*/makeIcon('Wallet', '<path fill-rule="evenodd" d="M3.5 5a.5.5 0 00-.5.5v2h5a.5.5 0 01.5.5c0 .253.08.644.306.958.207.288.557.542 1.194.542.637 0 .987-.254 1.194-.542.226-.314.306-.705.306-.958a.5.5 0 01.5-.5h5v-2a.5.5 0 00-.5-.5h-13zM17 8.5h-4.551a2.678 2.678 0 01-.443 1.042c-.393.546-1.043.958-2.006.958-.963 0-1.613-.412-2.006-.958A2.679 2.679 0 017.551 8.5H3v6a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-6zm-15-3A1.5 1.5 0 013.5 4h13A1.5 1.5 0 0118 5.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 14.5v-9z" clip-rule="evenodd"/>');
var BIconWatch = /*#__PURE__*/makeIcon('Watch', '<path fill-rule="evenodd" d="M6 16.333v-1.86A5.985 5.985 0 014 10c0-1.777.772-3.374 2-4.472V3.667C6 2.747 6.746 2 7.667 2h4.666C13.253 2 14 2.746 14 3.667v1.86A5.985 5.985 0 0116 10a5.985 5.985 0 01-2 4.472v1.861c0 .92-.746 1.667-1.667 1.667H7.667C6.747 18 6 17.254 6 16.333zM15 10a5 5 0 10-10 0 5 5 0 0010 0z" clip-rule="evenodd"/><rect width="1" height="2" x="15.5" y="9" rx=".5"/><path fill-rule="evenodd" d="M10 6.5a.5.5 0 01.5.5v3a.5.5 0 01-.5.5H8a.5.5 0 010-1h1.5V7a.5.5 0 01.5-.5z" clip-rule="evenodd"/>');
var BIconWifi = /*#__PURE__*/makeIcon('Wifi', '<path fill-rule="evenodd" d="M8.858 13.858A1.991 1.991 0 0110 13.5c.425 0 .818.132 1.142.358L10 15l-1.142-1.142z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.731 14.024l.269.269.269-.269a1.506 1.506 0 00-.538 0zm-1.159-.576A2.49 2.49 0 0110 13c.53 0 1.023.165 1.428.448a.5.5 0 01.068.763l-1.143 1.143a.5.5 0 01-.707 0L8.504 14.21a.5.5 0 01.354-.853v.5l-.286-.41zM10 11.5a4.478 4.478 0 00-2.7.9.5.5 0 01-.6-.8c.919-.69 2.062-1.1 3.3-1.1s2.381.41 3.3 1.1a.5.5 0 01-.6.8 4.478 4.478 0 00-2.7-.9zm0-3c-1.833 0-3.51.657-4.814 1.748a.5.5 0 11-.642-.766A8.468 8.468 0 0110 7.5c2.076 0 3.98.745 5.456 1.982a.5.5 0 01-.642.766A7.468 7.468 0 0010 8.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M10 5.5c-2.657 0-5.082.986-6.932 2.613a.5.5 0 11-.66-.75A11.458 11.458 0 0110 4.5c2.91 0 5.567 1.08 7.592 2.862a.5.5 0 11-.66.751A10.458 10.458 0 0010 5.5z" clip-rule="evenodd"/>');
var BIconWindow = /*#__PURE__*/makeIcon('Window', '<path fill-rule="evenodd" d="M16 4H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zM4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M17 8H3V7h14v1z" clip-rule="evenodd"/><path d="M5 5.5a.5.5 0 11-1 0 .5.5 0 011 0zm1.5 0a.5.5 0 11-1 0 .5.5 0 011 0zm1.5 0a.5.5 0 11-1 0 .5.5 0 011 0z"/>');
var BIconWrench = /*#__PURE__*/makeIcon('Wrench', '<path fill-rule="evenodd" d="M2.102 4.223A3.004 3.004 0 005 8c.27 0 .532-.036.78-.103l6.342 6.252A3.003 3.003 0 0015 18a3 3 0 10-.851-5.878L7.897 5.781A3.004 3.004 0 004.223 2.1l2.141 2.142L6 6l-1.757.364-2.141-2.141zm13.37 9.019L15 13l-.471.242-.529.026-.287.445-.445.287-.026.529L13 15l.242.471.026.529.445.287.287.445.529.026L15 17l.471-.242.529-.026.287-.445.445-.287.026-.529L17 15l-.242-.471-.026-.529-.445-.287-.287-.445-.529-.026z" clip-rule="evenodd"/>');
var BIconX = /*#__PURE__*/makeIcon('X', '<path fill-rule="evenodd" d="M5.646 5.646a.5.5 0 000 .708l8 8a.5.5 0 00.708-.708l-8-8a.5.5 0 00-.708 0z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14.354 5.646a.5.5 0 010 .708l-8 8a.5.5 0 01-.708-.708l8-8a.5.5 0 01.708 0z" clip-rule="evenodd"/>');
var BIconXCircle = /*#__PURE__*/makeIcon('XCircle', '<path fill-rule="evenodd" d="M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.646 13.354l-6-6 .708-.708 6 6-.708.708z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.354 13.354l6-6-.708-.708-6 6 .708.708z" clip-rule="evenodd"/>');
var BIconXCircleFill = /*#__PURE__*/makeIcon('XCircleFill', '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.354 6.646L10 9.293l2.646-2.647a.5.5 0 01.708.708L10.707 10l2.647 2.646a.5.5 0 01-.708.708L10 10.707l-2.646 2.647a.5.5 0 01-.708-.708L9.293 10 6.646 7.354a.5.5 0 11.708-.708z" clip-rule="evenodd"/>');
var BIconXOctagon = /*#__PURE__*/makeIcon('XOctagon', '<path fill-rule="evenodd" d="M6.54 2.146A.5.5 0 016.893 2h6.214a.5.5 0 01.353.146l4.394 4.394a.5.5 0 01.146.353v6.214a.5.5 0 01-.146.353l-4.394 4.394a.5.5 0 01-.353.146H6.893a.5.5 0 01-.353-.146L2.146 13.46A.5.5 0 012 13.107V6.893a.5.5 0 01.146-.353L6.54 2.146zM7.1 3L3 7.1v5.8L7.1 17h5.8l4.1-4.1V7.1L12.9 3H7.1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.293 10L6.646 7.354l.708-.708L10 9.293l2.646-2.647.708.708L10.707 10l2.647 2.646-.707.708L10 10.707l-2.646 2.647-.708-.707L9.293 10z" clip-rule="evenodd"/>');
var BIconXOctagonFill = /*#__PURE__*/makeIcon('XOctagonFill', '<path fill-rule="evenodd" d="M13.46 2.146A.5.5 0 0013.107 2H6.893a.5.5 0 00-.353.146L2.146 6.54A.5.5 0 002 6.893v6.214a.5.5 0 00.146.353l4.394 4.394a.5.5 0 00.353.146h6.214a.5.5 0 00.353-.146l4.394-4.394a.5.5 0 00.146-.353V6.893a.5.5 0 00-.146-.353L13.46 2.146zm-6.106 4.5L10 9.293l2.646-2.647a.5.5 0 01.708.708L10.707 10l2.647 2.646a.5.5 0 01-.708.708L10 10.707l-2.646 2.647a.5.5 0 01-.708-.708L9.293 10 6.646 7.354a.5.5 0 11.708-.708z" clip-rule="evenodd"/>');
var BIconXSquare = /*#__PURE__*/makeIcon('XSquare', '<path fill-rule="evenodd" d="M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.293 10L6.646 7.354l.708-.708L10 9.293l2.646-2.647.708.708L10.707 10l2.647 2.646-.708.708L10 10.707l-2.646 2.647-.708-.707L9.293 10z" clip-rule="evenodd"/>');
var BIconXSquareFill = /*#__PURE__*/makeIcon('XSquareFill', '<path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3.354 4.646L10 9.293l2.646-2.647a.5.5 0 01.708.708L10.707 10l2.647 2.646a.5.5 0 01-.708.708L10 10.707l-2.646 2.647a.5.5 0 01-.708-.708L9.293 10 6.646 7.354a.5.5 0 11.708-.708z" clip-rule="evenodd"/>'); // --- END AUTO-GENERATED FILE ---

var RX_ICON_PREFIX = /^BIcon/; // Helper BIcon component
// Requires the requested icon component to be installed

var BIcon = /*#__PURE__*/Vue.extend({
  name: 'BIcon',
  functional: true,
  props: _objectSpread2({
    icon: {
      type: String,
      default: null
    }
  }, commonIconProps, {
    stacked: {
      type: Boolean,
      default: false
    }
  }),
  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        parent = _ref.parent;
    var icon = pascalCase(trim(props.icon || '')).replace(RX_ICON_PREFIX, '');
    var iconName = "BIcon".concat(icon); // If parent context exists, we check to see if the icon has been registered
    // Either locally in the parent component, or globally at the `$root` level
    // If not registered, we render a blank icon

    var components = ((parent || {}).$options || {}).components;
    var componentRefOrName = icon && components ? components[iconName] || BIconBlank : icon ? iconName : BIconBlank;
    return h(componentRefOrName, mergeData(data, {
      props: _objectSpread2({}, props, {
        icon: null
      })
    }));
  }
});

var BIconstack = /*#__PURE__*/Vue.extend({
  name: 'BIconstack',
  functional: true,
  props: _objectSpread2({}, commonIconProps),
  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        children = _ref.children;
    return h(BVIconBase, mergeData(data, {
      staticClass: 'b-iconstack',
      props: _objectSpread2({}, props, {
        stacked: false
      })
    }), children);
  }
});

/**
 * Log a warning message to the console with BootstrapVue formatting
 * @param {string} message
 */

var warn = function warn(message)
/* istanbul ignore next */
{
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!getNoWarn()) {
    console.warn("[BootstrapVue warn]: ".concat(source ? "".concat(source, " - ") : '').concat(message));
  }
};

/**
 * Checks if there are multiple instances of Vue, and warns (once) about possible issues.
 * @param {object} Vue
 */

var checkMultipleVue = function () {
  var checkMultipleVueWarned = false;
  var MULTIPLE_VUE_WARNING = ['Multiple instances of Vue detected!', 'You may need to set up an alias for Vue in your bundler config.', 'See: https://bootstrap-vue.js.org/docs#using-module-bundlers'].join('\n');
  return function (Vue$1) {
    /* istanbul ignore next */
    if (!checkMultipleVueWarned && Vue !== Vue$1 && !isJSDOM) {
      warn(MULTIPLE_VUE_WARNING);
    }

    checkMultipleVueWarned = true;
  };
}();
/**
 * Plugin install factory function (no plugin config option).
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */

var installFactoryNoConfig = function installFactoryNoConfig() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      components = _ref2.components,
      directives = _ref2.directives,
      plugins = _ref2.plugins;

  var install = function install(Vue) {
    if (install.installed) {
      /* istanbul ignore next */
      return;
    }

    install.installed = true;
    checkMultipleVue(Vue);
    registerComponents(Vue, components);
    registerDirectives(Vue, directives);
    registerPlugins(Vue, plugins);
  };

  install.installed = false;
  return install;
};
/**
 * Plugin object factory function (no config option).
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */

var pluginFactoryNoConfig = function pluginFactoryNoConfig() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var extend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _objectSpread2({}, extend, {
    install: installFactoryNoConfig(options)
  });
};
/**
 * Load a group of plugins.
 * @param {object} Vue
 * @param {object} Plugin definitions
 */

var registerPlugins = function registerPlugins(Vue) {
  var plugins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var plugin in plugins) {
    if (plugin && plugins[plugin]) {
      Vue.use(plugins[plugin]);
    }
  }
};
/**
 * Load a component.
 * @param {object} Vue
 * @param {string} Component name
 * @param {object} Component definition
 */

var registerComponent = function registerComponent(Vue, name, def) {
  if (Vue && name && def) {
    Vue.component(name, def);
  }
};
/**
 * Load a group of components.
 * @param {object} Vue
 * @param {object} Object of component definitions
 */

var registerComponents = function registerComponents(Vue) {
  var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var component in components) {
    registerComponent(Vue, component, components[component]);
  }
};
/**
 * Load a directive.
 * @param {object} Vue
 * @param {string} Directive name
 * @param {object} Directive definition
 */

var registerDirective = function registerDirective(Vue, name, def) {
  if (Vue && name && def) {
    // Ensure that any leading V is removed from the
    // name, as Vue adds it automatically
    Vue.directive(name.replace(/^VB/, 'B'), def);
  }
};
/**
 * Load a group of directives.
 * @param {object} Vue
 * @param {object} Object of directive definitions
 */

var registerDirectives = function registerDirectives(Vue) {
  var directives = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var directive in directives) {
    registerDirective(Vue, directive, directives[directive]);
  }
};

// --- BEGIN AUTO-GENERATED FILE ---

var IconsPlugin = /*#__PURE__*/pluginFactoryNoConfig({
  components: {
    // Icon helper component
    BIcon: BIcon,
    // Icon stacking component
    BIconstack: BIconstack,
    // BootstrapVue custom icon components
    BIconBlank: BIconBlank,
    // Bootstrap icon components
    BIconAlarm: BIconAlarm,
    BIconAlarmFill: BIconAlarmFill,
    BIconAlertCircle: BIconAlertCircle,
    BIconAlertCircleFill: BIconAlertCircleFill,
    BIconAlertOctagon: BIconAlertOctagon,
    BIconAlertOctagonFill: BIconAlertOctagonFill,
    BIconAlertSquare: BIconAlertSquare,
    BIconAlertSquareFill: BIconAlertSquareFill,
    BIconAlertTriangle: BIconAlertTriangle,
    BIconAlertTriangleFill: BIconAlertTriangleFill,
    BIconArchive: BIconArchive,
    BIconArchiveFill: BIconArchiveFill,
    BIconArrowBarBottom: BIconArrowBarBottom,
    BIconArrowBarLeft: BIconArrowBarLeft,
    BIconArrowBarRight: BIconArrowBarRight,
    BIconArrowBarUp: BIconArrowBarUp,
    BIconArrowClockwise: BIconArrowClockwise,
    BIconArrowCounterclockwise: BIconArrowCounterclockwise,
    BIconArrowDown: BIconArrowDown,
    BIconArrowDownLeft: BIconArrowDownLeft,
    BIconArrowDownRight: BIconArrowDownRight,
    BIconArrowDownShort: BIconArrowDownShort,
    BIconArrowLeft: BIconArrowLeft,
    BIconArrowLeftRight: BIconArrowLeftRight,
    BIconArrowLeftShort: BIconArrowLeftShort,
    BIconArrowRepeat: BIconArrowRepeat,
    BIconArrowRight: BIconArrowRight,
    BIconArrowRightShort: BIconArrowRightShort,
    BIconArrowUp: BIconArrowUp,
    BIconArrowUpDown: BIconArrowUpDown,
    BIconArrowUpLeft: BIconArrowUpLeft,
    BIconArrowUpRight: BIconArrowUpRight,
    BIconArrowUpShort: BIconArrowUpShort,
    BIconArrowsAngleContract: BIconArrowsAngleContract,
    BIconArrowsAngleExpand: BIconArrowsAngleExpand,
    BIconArrowsCollapse: BIconArrowsCollapse,
    BIconArrowsExpand: BIconArrowsExpand,
    BIconArrowsFullscreen: BIconArrowsFullscreen,
    BIconAt: BIconAt,
    BIconAward: BIconAward,
    BIconBackspace: BIconBackspace,
    BIconBackspaceFill: BIconBackspaceFill,
    BIconBackspaceReverse: BIconBackspaceReverse,
    BIconBackspaceReverseFill: BIconBackspaceReverseFill,
    BIconBarChart: BIconBarChart,
    BIconBarChartFill: BIconBarChartFill,
    BIconBattery: BIconBattery,
    BIconBatteryCharging: BIconBatteryCharging,
    BIconBatteryFull: BIconBatteryFull,
    BIconBell: BIconBell,
    BIconBellFill: BIconBellFill,
    BIconBlockquoteLeft: BIconBlockquoteLeft,
    BIconBlockquoteRight: BIconBlockquoteRight,
    BIconBook: BIconBook,
    BIconBookHalfFill: BIconBookHalfFill,
    BIconBookmark: BIconBookmark,
    BIconBookmarkFill: BIconBookmarkFill,
    BIconBootstrap: BIconBootstrap,
    BIconBootstrapFill: BIconBootstrapFill,
    BIconBootstrapReboot: BIconBootstrapReboot,
    BIconBoxArrowBottomLeft: BIconBoxArrowBottomLeft,
    BIconBoxArrowBottomRight: BIconBoxArrowBottomRight,
    BIconBoxArrowDown: BIconBoxArrowDown,
    BIconBoxArrowLeft: BIconBoxArrowLeft,
    BIconBoxArrowRight: BIconBoxArrowRight,
    BIconBoxArrowUp: BIconBoxArrowUp,
    BIconBoxArrowUpLeft: BIconBoxArrowUpLeft,
    BIconBoxArrowUpRight: BIconBoxArrowUpRight,
    BIconBraces: BIconBraces,
    BIconBrightnessFillHigh: BIconBrightnessFillHigh,
    BIconBrightnessFillLow: BIconBrightnessFillLow,
    BIconBrightnessHigh: BIconBrightnessHigh,
    BIconBrightnessLow: BIconBrightnessLow,
    BIconBrush: BIconBrush,
    BIconBucket: BIconBucket,
    BIconBucketFill: BIconBucketFill,
    BIconBuilding: BIconBuilding,
    BIconBullseye: BIconBullseye,
    BIconCalendar: BIconCalendar,
    BIconCalendarFill: BIconCalendarFill,
    BIconCamera: BIconCamera,
    BIconCameraVideo: BIconCameraVideo,
    BIconCameraVideoFill: BIconCameraVideoFill,
    BIconCapslock: BIconCapslock,
    BIconCapslockFill: BIconCapslockFill,
    BIconChat: BIconChat,
    BIconChatFill: BIconChatFill,
    BIconCheck: BIconCheck,
    BIconCheckBox: BIconCheckBox,
    BIconCheckCircle: BIconCheckCircle,
    BIconChevronCompactDown: BIconChevronCompactDown,
    BIconChevronCompactLeft: BIconChevronCompactLeft,
    BIconChevronCompactRight: BIconChevronCompactRight,
    BIconChevronCompactUp: BIconChevronCompactUp,
    BIconChevronDown: BIconChevronDown,
    BIconChevronLeft: BIconChevronLeft,
    BIconChevronRight: BIconChevronRight,
    BIconChevronUp: BIconChevronUp,
    BIconCircle: BIconCircle,
    BIconCircleFill: BIconCircleFill,
    BIconCircleHalf: BIconCircleHalf,
    BIconCircleSlash: BIconCircleSlash,
    BIconClock: BIconClock,
    BIconClockFill: BIconClockFill,
    BIconCloud: BIconCloud,
    BIconCloudDownload: BIconCloudDownload,
    BIconCloudFill: BIconCloudFill,
    BIconCloudUpload: BIconCloudUpload,
    BIconCode: BIconCode,
    BIconCodeSlash: BIconCodeSlash,
    BIconColumns: BIconColumns,
    BIconColumnsGutters: BIconColumnsGutters,
    BIconCommand: BIconCommand,
    BIconCompass: BIconCompass,
    BIconCone: BIconCone,
    BIconConeStriped: BIconConeStriped,
    BIconController: BIconController,
    BIconCreditCard: BIconCreditCard,
    BIconCursor: BIconCursor,
    BIconCursorFill: BIconCursorFill,
    BIconDash: BIconDash,
    BIconDiamond: BIconDiamond,
    BIconDiamondHalf: BIconDiamondHalf,
    BIconDisplay: BIconDisplay,
    BIconDisplayFill: BIconDisplayFill,
    BIconDocument: BIconDocument,
    BIconDocumentCode: BIconDocumentCode,
    BIconDocumentDiff: BIconDocumentDiff,
    BIconDocumentRichtext: BIconDocumentRichtext,
    BIconDocumentSpreadsheet: BIconDocumentSpreadsheet,
    BIconDocumentText: BIconDocumentText,
    BIconDocuments: BIconDocuments,
    BIconDocumentsAlt: BIconDocumentsAlt,
    BIconDot: BIconDot,
    BIconDownload: BIconDownload,
    BIconEggFried: BIconEggFried,
    BIconEject: BIconEject,
    BIconEjectFill: BIconEjectFill,
    BIconEnvelope: BIconEnvelope,
    BIconEnvelopeFill: BIconEnvelopeFill,
    BIconEnvelopeOpen: BIconEnvelopeOpen,
    BIconEnvelopeOpenFill: BIconEnvelopeOpenFill,
    BIconEye: BIconEye,
    BIconEyeFill: BIconEyeFill,
    BIconEyeSlash: BIconEyeSlash,
    BIconEyeSlashFill: BIconEyeSlashFill,
    BIconFilter: BIconFilter,
    BIconFlag: BIconFlag,
    BIconFlagFill: BIconFlagFill,
    BIconFolder: BIconFolder,
    BIconFolderFill: BIconFolderFill,
    BIconFolderSymlink: BIconFolderSymlink,
    BIconFolderSymlinkFill: BIconFolderSymlinkFill,
    BIconFonts: BIconFonts,
    BIconForward: BIconForward,
    BIconForwardFill: BIconForwardFill,
    BIconGear: BIconGear,
    BIconGearFill: BIconGearFill,
    BIconGearWide: BIconGearWide,
    BIconGearWideConnected: BIconGearWideConnected,
    BIconGeo: BIconGeo,
    BIconGraphDown: BIconGraphDown,
    BIconGraphUp: BIconGraphUp,
    BIconGrid: BIconGrid,
    BIconGridFill: BIconGridFill,
    BIconHammer: BIconHammer,
    BIconHash: BIconHash,
    BIconHeart: BIconHeart,
    BIconHeartFill: BIconHeartFill,
    BIconHouse: BIconHouse,
    BIconHouseFill: BIconHouseFill,
    BIconImage: BIconImage,
    BIconImageAlt: BIconImageAlt,
    BIconImageFill: BIconImageFill,
    BIconImages: BIconImages,
    BIconInbox: BIconInbox,
    BIconInboxFill: BIconInboxFill,
    BIconInboxes: BIconInboxes,
    BIconInboxesFill: BIconInboxesFill,
    BIconInfo: BIconInfo,
    BIconInfoFill: BIconInfoFill,
    BIconInfoSquare: BIconInfoSquare,
    BIconInfoSquareFill: BIconInfoSquareFill,
    BIconJustify: BIconJustify,
    BIconJustifyLeft: BIconJustifyLeft,
    BIconJustifyRight: BIconJustifyRight,
    BIconKanban: BIconKanban,
    BIconKanbanFill: BIconKanbanFill,
    BIconLaptop: BIconLaptop,
    BIconLayoutSidebar: BIconLayoutSidebar,
    BIconLayoutSidebarReverse: BIconLayoutSidebarReverse,
    BIconLayoutSplit: BIconLayoutSplit,
    BIconList: BIconList,
    BIconListCheck: BIconListCheck,
    BIconListOl: BIconListOl,
    BIconListTask: BIconListTask,
    BIconListUl: BIconListUl,
    BIconLock: BIconLock,
    BIconLockFill: BIconLockFill,
    BIconMap: BIconMap,
    BIconMic: BIconMic,
    BIconMoon: BIconMoon,
    BIconMusicPlayer: BIconMusicPlayer,
    BIconMusicPlayerFill: BIconMusicPlayerFill,
    BIconOption: BIconOption,
    BIconOutlet: BIconOutlet,
    BIconPause: BIconPause,
    BIconPauseFill: BIconPauseFill,
    BIconPen: BIconPen,
    BIconPencil: BIconPencil,
    BIconPeople: BIconPeople,
    BIconPeopleFill: BIconPeopleFill,
    BIconPerson: BIconPerson,
    BIconPersonFill: BIconPersonFill,
    BIconPhone: BIconPhone,
    BIconPhoneLandscape: BIconPhoneLandscape,
    BIconPieChart: BIconPieChart,
    BIconPieChartFill: BIconPieChartFill,
    BIconPlay: BIconPlay,
    BIconPlayFill: BIconPlayFill,
    BIconPlug: BIconPlug,
    BIconPlus: BIconPlus,
    BIconPower: BIconPower,
    BIconQuestion: BIconQuestion,
    BIconQuestionFill: BIconQuestionFill,
    BIconQuestionSquare: BIconQuestionSquare,
    BIconQuestionSquareFill: BIconQuestionSquareFill,
    BIconReply: BIconReply,
    BIconReplyAll: BIconReplyAll,
    BIconReplyAllFill: BIconReplyAllFill,
    BIconReplyFill: BIconReplyFill,
    BIconScrewdriver: BIconScrewdriver,
    BIconSearch: BIconSearch,
    BIconShield: BIconShield,
    BIconShieldFill: BIconShieldFill,
    BIconShieldLock: BIconShieldLock,
    BIconShieldLockFill: BIconShieldLockFill,
    BIconShieldShaded: BIconShieldShaded,
    BIconShift: BIconShift,
    BIconShiftFill: BIconShiftFill,
    BIconSkipBackward: BIconSkipBackward,
    BIconSkipBackwardFill: BIconSkipBackwardFill,
    BIconSkipEnd: BIconSkipEnd,
    BIconSkipEndFill: BIconSkipEndFill,
    BIconSkipForward: BIconSkipForward,
    BIconSkipForwardFill: BIconSkipForwardFill,
    BIconSkipStart: BIconSkipStart,
    BIconSkipStartFill: BIconSkipStartFill,
    BIconSpeaker: BIconSpeaker,
    BIconSquare: BIconSquare,
    BIconSquareFill: BIconSquareFill,
    BIconSquareHalf: BIconSquareHalf,
    BIconStar: BIconStar,
    BIconStarFill: BIconStarFill,
    BIconStarHalf: BIconStarHalf,
    BIconStop: BIconStop,
    BIconStopFill: BIconStopFill,
    BIconStopwatch: BIconStopwatch,
    BIconStopwatchFill: BIconStopwatchFill,
    BIconSun: BIconSun,
    BIconTable: BIconTable,
    BIconTablet: BIconTablet,
    BIconTabletLandscape: BIconTabletLandscape,
    BIconTag: BIconTag,
    BIconTagFill: BIconTagFill,
    BIconTerminal: BIconTerminal,
    BIconTerminalFill: BIconTerminalFill,
    BIconTextCenter: BIconTextCenter,
    BIconTextIndentLeft: BIconTextIndentLeft,
    BIconTextIndentRight: BIconTextIndentRight,
    BIconTextLeft: BIconTextLeft,
    BIconTextRight: BIconTextRight,
    BIconThreeDots: BIconThreeDots,
    BIconThreeDotsVertical: BIconThreeDotsVertical,
    BIconToggleOff: BIconToggleOff,
    BIconToggleOn: BIconToggleOn,
    BIconToggles: BIconToggles,
    BIconTools: BIconTools,
    BIconTrash: BIconTrash,
    BIconTrashFill: BIconTrashFill,
    BIconTriangle: BIconTriangle,
    BIconTriangleFill: BIconTriangleFill,
    BIconTriangleHalf: BIconTriangleHalf,
    BIconTrophy: BIconTrophy,
    BIconTv: BIconTv,
    BIconTvFill: BIconTvFill,
    BIconType: BIconType,
    BIconTypeBold: BIconTypeBold,
    BIconTypeH1: BIconTypeH1,
    BIconTypeH2: BIconTypeH2,
    BIconTypeH3: BIconTypeH3,
    BIconTypeItalic: BIconTypeItalic,
    BIconTypeStrikethrough: BIconTypeStrikethrough,
    BIconTypeUnderline: BIconTypeUnderline,
    BIconUnlock: BIconUnlock,
    BIconUnlockFill: BIconUnlockFill,
    BIconUpload: BIconUpload,
    BIconVolumeDown: BIconVolumeDown,
    BIconVolumeDownFill: BIconVolumeDownFill,
    BIconVolumeMute: BIconVolumeMute,
    BIconVolumeMuteFill: BIconVolumeMuteFill,
    BIconVolumeUp: BIconVolumeUp,
    BIconVolumeUpFill: BIconVolumeUpFill,
    BIconWallet: BIconWallet,
    BIconWatch: BIconWatch,
    BIconWifi: BIconWifi,
    BIconWindow: BIconWindow,
    BIconWrench: BIconWrench,
    BIconX: BIconX,
    BIconXCircle: BIconXCircle,
    BIconXCircleFill: BIconXCircleFill,
    BIconXOctagon: BIconXOctagon,
    BIconXOctagonFill: BIconXOctagonFill,
    BIconXSquare: BIconXSquare,
    BIconXSquareFill: BIconXSquareFill
  }
}); // Export the BootstrapVueIcons plugin installer
// Mainly for the stand-alone bootstrap-vue-icons.xxx.js builds

var BootstrapVueIcons = /*#__PURE__*/pluginFactoryNoConfig({
  plugins: {
    IconsPlugin: IconsPlugin
  }
}, {
  NAME: 'BootstrapVueIcons'
}); // --- END AUTO-GENERATED FILE ---

// Icons only build
var install = BootstrapVueIcons.install;
var NAME = BootstrapVueIcons.NAME;

export default BootstrapVueIcons;
export { BIcon, BIconAlarm, BIconAlarmFill, BIconAlertCircle, BIconAlertCircleFill, BIconAlertOctagon, BIconAlertOctagonFill, BIconAlertSquare, BIconAlertSquareFill, BIconAlertTriangle, BIconAlertTriangleFill, BIconArchive, BIconArchiveFill, BIconArrowBarBottom, BIconArrowBarLeft, BIconArrowBarRight, BIconArrowBarUp, BIconArrowClockwise, BIconArrowCounterclockwise, BIconArrowDown, BIconArrowDownLeft, BIconArrowDownRight, BIconArrowDownShort, BIconArrowLeft, BIconArrowLeftRight, BIconArrowLeftShort, BIconArrowRepeat, BIconArrowRight, BIconArrowRightShort, BIconArrowUp, BIconArrowUpDown, BIconArrowUpLeft, BIconArrowUpRight, BIconArrowUpShort, BIconArrowsAngleContract, BIconArrowsAngleExpand, BIconArrowsCollapse, BIconArrowsExpand, BIconArrowsFullscreen, BIconAt, BIconAward, BIconBackspace, BIconBackspaceFill, BIconBackspaceReverse, BIconBackspaceReverseFill, BIconBarChart, BIconBarChartFill, BIconBattery, BIconBatteryCharging, BIconBatteryFull, BIconBell, BIconBellFill, BIconBlank, BIconBlockquoteLeft, BIconBlockquoteRight, BIconBook, BIconBookHalfFill, BIconBookmark, BIconBookmarkFill, BIconBootstrap, BIconBootstrapFill, BIconBootstrapReboot, BIconBoxArrowBottomLeft, BIconBoxArrowBottomRight, BIconBoxArrowDown, BIconBoxArrowLeft, BIconBoxArrowRight, BIconBoxArrowUp, BIconBoxArrowUpLeft, BIconBoxArrowUpRight, BIconBraces, BIconBrightnessFillHigh, BIconBrightnessFillLow, BIconBrightnessHigh, BIconBrightnessLow, BIconBrush, BIconBucket, BIconBucketFill, BIconBuilding, BIconBullseye, BIconCalendar, BIconCalendarFill, BIconCamera, BIconCameraVideo, BIconCameraVideoFill, BIconCapslock, BIconCapslockFill, BIconChat, BIconChatFill, BIconCheck, BIconCheckBox, BIconCheckCircle, BIconChevronCompactDown, BIconChevronCompactLeft, BIconChevronCompactRight, BIconChevronCompactUp, BIconChevronDown, BIconChevronLeft, BIconChevronRight, BIconChevronUp, BIconCircle, BIconCircleFill, BIconCircleHalf, BIconCircleSlash, BIconClock, BIconClockFill, BIconCloud, BIconCloudDownload, BIconCloudFill, BIconCloudUpload, BIconCode, BIconCodeSlash, BIconColumns, BIconColumnsGutters, BIconCommand, BIconCompass, BIconCone, BIconConeStriped, BIconController, BIconCreditCard, BIconCursor, BIconCursorFill, BIconDash, BIconDiamond, BIconDiamondHalf, BIconDisplay, BIconDisplayFill, BIconDocument, BIconDocumentCode, BIconDocumentDiff, BIconDocumentRichtext, BIconDocumentSpreadsheet, BIconDocumentText, BIconDocuments, BIconDocumentsAlt, BIconDot, BIconDownload, BIconEggFried, BIconEject, BIconEjectFill, BIconEnvelope, BIconEnvelopeFill, BIconEnvelopeOpen, BIconEnvelopeOpenFill, BIconEye, BIconEyeFill, BIconEyeSlash, BIconEyeSlashFill, BIconFilter, BIconFlag, BIconFlagFill, BIconFolder, BIconFolderFill, BIconFolderSymlink, BIconFolderSymlinkFill, BIconFonts, BIconForward, BIconForwardFill, BIconGear, BIconGearFill, BIconGearWide, BIconGearWideConnected, BIconGeo, BIconGraphDown, BIconGraphUp, BIconGrid, BIconGridFill, BIconHammer, BIconHash, BIconHeart, BIconHeartFill, BIconHouse, BIconHouseFill, BIconImage, BIconImageAlt, BIconImageFill, BIconImages, BIconInbox, BIconInboxFill, BIconInboxes, BIconInboxesFill, BIconInfo, BIconInfoFill, BIconInfoSquare, BIconInfoSquareFill, BIconJustify, BIconJustifyLeft, BIconJustifyRight, BIconKanban, BIconKanbanFill, BIconLaptop, BIconLayoutSidebar, BIconLayoutSidebarReverse, BIconLayoutSplit, BIconList, BIconListCheck, BIconListOl, BIconListTask, BIconListUl, BIconLock, BIconLockFill, BIconMap, BIconMic, BIconMoon, BIconMusicPlayer, BIconMusicPlayerFill, BIconOption, BIconOutlet, BIconPause, BIconPauseFill, BIconPen, BIconPencil, BIconPeople, BIconPeopleFill, BIconPerson, BIconPersonFill, BIconPhone, BIconPhoneLandscape, BIconPieChart, BIconPieChartFill, BIconPlay, BIconPlayFill, BIconPlug, BIconPlus, BIconPower, BIconQuestion, BIconQuestionFill, BIconQuestionSquare, BIconQuestionSquareFill, BIconReply, BIconReplyAll, BIconReplyAllFill, BIconReplyFill, BIconScrewdriver, BIconSearch, BIconShield, BIconShieldFill, BIconShieldLock, BIconShieldLockFill, BIconShieldShaded, BIconShift, BIconShiftFill, BIconSkipBackward, BIconSkipBackwardFill, BIconSkipEnd, BIconSkipEndFill, BIconSkipForward, BIconSkipForwardFill, BIconSkipStart, BIconSkipStartFill, BIconSpeaker, BIconSquare, BIconSquareFill, BIconSquareHalf, BIconStar, BIconStarFill, BIconStarHalf, BIconStop, BIconStopFill, BIconStopwatch, BIconStopwatchFill, BIconSun, BIconTable, BIconTablet, BIconTabletLandscape, BIconTag, BIconTagFill, BIconTerminal, BIconTerminalFill, BIconTextCenter, BIconTextIndentLeft, BIconTextIndentRight, BIconTextLeft, BIconTextRight, BIconThreeDots, BIconThreeDotsVertical, BIconToggleOff, BIconToggleOn, BIconToggles, BIconTools, BIconTrash, BIconTrashFill, BIconTriangle, BIconTriangleFill, BIconTriangleHalf, BIconTrophy, BIconTv, BIconTvFill, BIconType, BIconTypeBold, BIconTypeH1, BIconTypeH2, BIconTypeH3, BIconTypeItalic, BIconTypeStrikethrough, BIconTypeUnderline, BIconUnlock, BIconUnlockFill, BIconUpload, BIconVolumeDown, BIconVolumeDownFill, BIconVolumeMute, BIconVolumeMuteFill, BIconVolumeUp, BIconVolumeUpFill, BIconWallet, BIconWatch, BIconWifi, BIconWindow, BIconWrench, BIconX, BIconXCircle, BIconXCircleFill, BIconXOctagon, BIconXOctagonFill, BIconXSquare, BIconXSquareFill, BootstrapVueIcons, IconsPlugin, NAME, install };
//# sourceMappingURL=bootstrap-vue-icons.esm.js.map
