"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListBoxHeader = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _InputText = require("../inputtext/InputText");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ListBoxHeader =
/*#__PURE__*/
function (_Component) {
  _inherits(ListBoxHeader, _Component);

  function ListBoxHeader() {
    var _this;

    _classCallCheck(this, ListBoxHeader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListBoxHeader).call(this));
    _this.onFilter = _this.onFilter.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ListBoxHeader, [{
    key: "onFilter",
    value: function onFilter(event) {
      if (this.props.onFilter) {
        this.props.onFilter({
          originalEvent: event,
          query: event.target.value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "p-listbox-header"
      }, _react.default.createElement("div", {
        className: "p-listbox-filter-container"
      }, _react.default.createElement(_InputText.InputText, {
        type: "text",
        role: "textbox",
        value: this.props.filter,
        onChange: this.onFilter,
        disabled: this.props.disabled
      }), _react.default.createElement("span", {
        className: "p-listbox-filter-icon pi pi-search"
      })));
    }
  }]);

  return ListBoxHeader;
}(_react.Component);

exports.ListBoxHeader = ListBoxHeader;

_defineProperty(ListBoxHeader, "defaultProps", {
  filter: null,
  disabled: false,
  onFilter: null
});

_defineProperty(ListBoxHeader, "propTypes", {
  filter: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  onFilter: _propTypes.default.func
});