(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('primeng/dom')) :
    typeof define === 'function' && define.amd ? define('primeng/blockui', ['exports', '@angular/core', '@angular/common', 'primeng/dom'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.blockui = {}), global.ng.core, global.ng.common, global.primeng.dom));
}(this, (function (exports, core, common, dom) { 'use strict';

    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var BlockUI = /** @class */ (function () {
        function BlockUI(el) {
            this.el = el;
            this.autoZIndex = true;
            this.baseZIndex = 0;
        }
        Object.defineProperty(BlockUI.prototype, "blocked", {
            get: function () {
                return this._blocked;
            },
            set: function (val) {
                this._blocked = val;
                if (this.mask && this.mask.nativeElement) {
                    if (this._blocked)
                        this.block();
                    else
                        this.unblock();
                }
            },
            enumerable: true,
            configurable: true
        });
        BlockUI.prototype.ngAfterViewInit = function () {
            if (this.target && !this.target.getBlockableElement) {
                throw 'Target of BlockUI must implement BlockableUI interface';
            }
        };
        BlockUI.prototype.block = function () {
            if (this.target) {
                this.target.getBlockableElement().appendChild(this.mask.nativeElement);
                var style = this.target.style || {};
                style.position = 'relative';
                this.target.style = style;
            }
            else {
                document.body.appendChild(this.mask.nativeElement);
            }
            if (this.autoZIndex) {
                this.mask.nativeElement.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
            }
        };
        BlockUI.prototype.unblock = function () {
            this.el.nativeElement.appendChild(this.mask.nativeElement);
        };
        BlockUI.prototype.ngOnDestroy = function () {
            this.unblock();
        };
        BlockUI.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        __decorate([
            core.Input()
        ], BlockUI.prototype, "target", void 0);
        __decorate([
            core.Input()
        ], BlockUI.prototype, "autoZIndex", void 0);
        __decorate([
            core.Input()
        ], BlockUI.prototype, "baseZIndex", void 0);
        __decorate([
            core.Input()
        ], BlockUI.prototype, "styleClass", void 0);
        __decorate([
            core.ViewChild('mask')
        ], BlockUI.prototype, "mask", void 0);
        __decorate([
            core.Input()
        ], BlockUI.prototype, "blocked", null);
        BlockUI = __decorate([
            core.Component({
                selector: 'p-blockUI',
                template: "\n        <div #mask [class]=\"styleClass\" [ngClass]=\"{'ui-blockui-document':!target, 'ui-blockui ui-widget-overlay': true}\" [ngStyle]=\"{display: blocked ? 'block' : 'none'}\">\n            <ng-content></ng-content>\n        </div>\n    ",
                changeDetection: core.ChangeDetectionStrategy.Default
            })
        ], BlockUI);
        return BlockUI;
    }());
    var BlockUIModule = /** @class */ (function () {
        function BlockUIModule() {
        }
        BlockUIModule = __decorate([
            core.NgModule({
                imports: [common.CommonModule],
                exports: [BlockUI],
                declarations: [BlockUI]
            })
        ], BlockUIModule);
        return BlockUIModule;
    }());

    exports.BlockUI = BlockUI;
    exports.BlockUIModule = BlockUIModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-blockui.umd.js.map
