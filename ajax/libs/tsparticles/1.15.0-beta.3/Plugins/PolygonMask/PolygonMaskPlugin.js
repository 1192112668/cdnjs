"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonMaskPlugin = void 0;
var PolygonMaskInstance_1 = require("./PolygonMaskInstance");
var index_slim_1 = require("../../index.slim");
var PolygonMaskPlugin = (function () {
    function PolygonMaskPlugin() {
        this.id = "polygonMask";
    }
    PolygonMaskPlugin.prototype.getPlugin = function (container) {
        return new PolygonMaskInstance_1.PolygonMaskInstance(container);
    };
    PolygonMaskPlugin.prototype.needsPlugin = function (options) {
        var _a, _b;
        return (_b = (_a = options === null || options === void 0 ? void 0 : options.polygon) === null || _a === void 0 ? void 0 : _a.enable) !== null && _b !== void 0 ? _b : false;
    };
    return PolygonMaskPlugin;
}());
var plugin = new PolygonMaskPlugin();
exports.PolygonMaskPlugin = plugin;
index_slim_1.tsParticles.addPlugin(plugin);
__exportStar(require("./Enums"), exports);
