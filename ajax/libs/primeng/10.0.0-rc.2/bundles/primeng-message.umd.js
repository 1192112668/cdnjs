(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('primeng/message', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.message = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var UIMessage = /** @class */ (function () {
        function UIMessage() {
            this.escape = true;
        }
        Object.defineProperty(UIMessage.prototype, "icon", {
            get: function () {
                var icon = null;
                if (this.severity) {
                    switch (this.severity) {
                        case 'success':
                            icon = 'pi pi-check';
                            break;
                        case 'info':
                            icon = 'pi pi-info-circle';
                            break;
                        case 'error':
                            icon = 'pi pi-times-circle';
                            break;
                        case 'warn':
                            icon = 'pi pi-exclamation-triangle';
                            break;
                        default:
                            icon = 'pi pi-info-circle';
                            break;
                    }
                }
                return icon;
            },
            enumerable: false,
            configurable: true
        });
        UIMessage.decorators = [
            { type: core.Component, args: [{
                        selector: 'p-message',
                        template: "\n        <div aria-live=\"polite\" class=\"p-inline-message p-component p-inline-message\" *ngIf=\"severity\"\n        [ngClass]=\"{'p-inline-message-info': (severity === 'info'),\n                'p-inline-message-warn': (severity === 'warn'),\n                'p-inline-message-error': (severity === 'error'),\n                'p-inline-message-success': (severity === 'success'),\n                'p-inline-message-icon-only': this.text == null}\">\n            <span class=\"p-inline-message-icon\" [ngClass]=\"icon\"></span>\n            <div *ngIf=\"!escape; else escapeOut\">\n                <span *ngIf=\"!escape\" class=\"p-inline-message-text\" [innerHTML]=\"text\"></span>\n            </div>\n            <ng-template #escapeOut>\n                <span *ngIf=\"escape\" class=\"p-inline-message-text\">{{text}}</span>\n            </ng-template>\n        </div>\n    ",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".p-inline-message{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;vertical-align:top}.p-inline-message-icon-only .p-inline-message-text{visibility:hidden;width:0}.p-fluid .p-inline-message{display:-ms-flexbox;display:flex}"]
                    },] }
        ];
        UIMessage.propDecorators = {
            severity: [{ type: core.Input }],
            text: [{ type: core.Input }],
            escape: [{ type: core.Input }]
        };
        return UIMessage;
    }());
    var MessageModule = /** @class */ (function () {
        function MessageModule() {
        }
        MessageModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        exports: [UIMessage],
                        declarations: [UIMessage]
                    },] }
        ];
        return MessageModule;
    }());

    exports.MessageModule = MessageModule;
    exports.UIMessage = UIMessage;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-message.umd.js.map
