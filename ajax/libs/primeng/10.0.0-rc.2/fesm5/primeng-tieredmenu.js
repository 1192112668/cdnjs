import { Inject, forwardRef, ChangeDetectorRef, Renderer2, Component, ViewEncapsulation, Input, ElementRef, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';

var TieredMenuSub = /** @class */ (function () {
    function TieredMenuSub(tieredMenu, cf, renderer) {
        this.cf = cf;
        this.renderer = renderer;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.tieredMenu = tieredMenu;
    }
    Object.defineProperty(TieredMenuSub.prototype, "parentActive", {
        get: function () {
            return this._parentActive;
        },
        set: function (value) {
            this._parentActive = value;
            if (!value) {
                this.activeItem = null;
            }
        },
        enumerable: false,
        configurable: true
    });
    TieredMenuSub.prototype.ngAfterViewInit = function () {
        if (this.root && !this.tieredMenu.popup) {
            this.bindDocumentClickListener();
        }
    };
    TieredMenuSub.prototype.onItemMouseEnter = function (event, item, menuitem) {
        if (this.tieredMenu.popup || (!this.root || this.activeItem)) {
            if (menuitem.disabled) {
                return;
            }
            this.activeItem = item;
            var nextElement = item.children[0].nextElementSibling;
            if (nextElement) {
                var sublist = nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                sublist.style.zIndex = String(++DomHandler.zindex);
                sublist.style.top = '0px';
                sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
            }
        }
    };
    TieredMenuSub.prototype.itemClick = function (event, item, menuitem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return true;
        }
        if (!menuitem.url) {
            event.preventDefault();
        }
        if (menuitem.command) {
            menuitem.command({
                originalEvent: event,
                item: menuitem
            });
        }
        if (this.root && !this.activeItem && !this.tieredMenu.popup) {
            this.activeItem = item;
            var nextElement = item.children[0].nextElementSibling;
            if (nextElement) {
                var sublist = nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                sublist.style.zIndex = String(++DomHandler.zindex);
                sublist.style.top = '0px';
                sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
                this.rootItemClick = true;
            }
        }
        if (!menuitem.items && this.tieredMenu.popup) {
            this.tieredMenu.hide();
        }
    };
    TieredMenuSub.prototype.listClick = function (event) {
        if (!this.rootItemClick) {
            this.activeItem = null;
        }
    };
    TieredMenuSub.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!_this.rootItemClick) {
                    _this.parentActive = false;
                    _this.activeItem = null;
                    _this.cf.markForCheck();
                }
                _this.rootItemClick = false;
            });
        }
    };
    TieredMenuSub.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    TieredMenuSub.prototype.ngOnDestroy = function () {
        if (this.root && !this.tieredMenu.popup) {
            this.unbindDocumentClickListener();
        }
    };
    TieredMenuSub.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return TieredMenu; }),] }] },
        { type: ChangeDetectorRef },
        { type: Renderer2 }
    ]; };
    TieredMenuSub.decorators = [
        { type: Component, args: [{
                    selector: 'p-tieredMenuSub',
                    template: "\n        <ul [ngClass]=\"{'p-submenu-list': !root}\" (click)=\"listClick($event)\" role=\"menubar\">\n            <ng-template ngFor let-child [ngForOf]=\"(root ? item : item.items)\">\n                <li *ngIf=\"child.separator\" class=\"p-menu-separator\" [ngClass]=\"{'p-hidden': child.visible === false}\" role=\"separator\">\n                <li *ngIf=\"!child.separator\" #listItem [ngClass]=\"{'p-menuitem':true,'p-menuitem-active':listItem==activeItem,'p-hidden': child.visible === false}\"\n                    [class]=\"child.styleClass\" [ngStyle]=\"child.style\" role=\"none\"\n                    (mouseenter)=\"onItemMouseEnter($event, listItem, child)\">\n                    <a *ngIf=\"!child.routerLink\" [attr.href]=\"child.url\" class=\"p-menuitem-link\" [attr.target]=\"child.target\" [attr.tabindex]=\"child.disabled ? null : '0'\" [attr.title]=\"child.title\" [attr.id]=\"child.id\" \n                        [ngClass]=\"{'p-disabled':child.disabled}\" (click)=\"itemClick($event, listItem, child)\" role=\"menuitem\" [attr.aria-haspopup]=\"item.items != null\" [attr.aria-expanded]=\"item === activeItem\" pRipple>\n                        <span class=\"p-menuitem-icon\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"p-menuitem-text\">{{child.label}}</span>\n                        <span class=\"p-submenu-icon pi pi-angle-right\" *ngIf=\"child.items\"></span>\n                    </a>\n                    <a *ngIf=\"child.routerLink\" [routerLink]=\"child.routerLink\" role=\"menuitem\" [queryParams]=\"child.queryParams\" [routerLinkActive]=\"'p-menuitem-link-active'\" role=\"menuitem\" [attr.tabindex]=\"child.disabled ? null : '0'\"\n                        [routerLinkActiveOptions]=\"child.routerLinkActiveOptions||{exact:false}\"\n                        class=\"p-menuitem-link\" [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\"\n                        [ngClass]=\"{'p-disabled':child.disabled}\" (click)=\"itemClick($event, listItem, child)\" pRipple\n                        [fragment]=\"child.fragment\" [queryParamsHandling]=\"child.queryParamsHandling\" [preserveFragment]=\"child.preserveFragment\" [skipLocationChange]=\"child.skipLocationChange\" [replaceUrl]=\"child.replaceUrl\" [state]=\"child.state\">\n                        <span class=\"p-menuitem-icon\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"p-menuitem-text\">{{child.label}}</span>\n                        <span class=\"p-submenu-icon pi pi-angle-right\" *ngIf=\"child.items\"></span>\n                    </a>\n                    <p-tieredMenuSub [item]=\"child\" *ngIf=\"child.items\" [baseZIndex]=\"baseZIndex\" [parentActive]=\"listItem==activeItem\" [autoZIndex]=\"autoZIndex\"></p-tieredMenuSub>\n                </li>\n            </ng-template>\n        </ul>\n    ",
                    encapsulation: ViewEncapsulation.None,
                    styles: [".p-tieredmenu-overlay{position:absolute}.p-tieredmenu ul{margin:0;padding:0;list-style:none}.p-tieredmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-tieredmenu .p-menuitem-link{cursor:pointer;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-tieredmenu .p-menuitem-text{line-height:1}.p-tieredmenu .p-menuitem{position:relative}.p-tieredmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-tieredmenu .p-menuitem-active>p-tieredmenusub>.p-submenu-list{display:block;left:100%;top:0}"]
                },] }
    ];
    TieredMenuSub.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return TieredMenu; }),] }] },
        { type: ChangeDetectorRef },
        { type: Renderer2 }
    ]; };
    TieredMenuSub.propDecorators = {
        item: [{ type: Input }],
        root: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        parentActive: [{ type: Input }]
    };
    return TieredMenuSub;
}());
var TieredMenu = /** @class */ (function () {
    function TieredMenu(el, renderer, cd) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
    }
    TieredMenu.prototype.toggle = function (event) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
        this.preventDocumentDefault = true;
    };
    TieredMenu.prototype.show = function (event) {
        this.target = event.currentTarget;
        this.visible = true;
        this.parentActive = true;
        this.preventDocumentDefault = true;
        this.cd.markForCheck();
    };
    TieredMenu.prototype.onOverlayAnimationStart = function (event) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.container = event.element;
                    this.moveOnTop();
                    this.appendOverlay();
                    DomHandler.absolutePosition(this.container, this.target);
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                }
                break;
            case 'void':
                this.onOverlayHide();
                break;
        }
    };
    TieredMenu.prototype.appendOverlay = function () {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    };
    TieredMenu.prototype.restoreOverlayAppend = function () {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    };
    TieredMenu.prototype.moveOnTop = function () {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
    };
    TieredMenu.prototype.hide = function () {
        this.visible = false;
        this.parentActive = false;
        this.cd.markForCheck();
    };
    TieredMenu.prototype.onWindowResize = function () {
        this.hide();
    };
    TieredMenu.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!_this.preventDocumentDefault && _this.popup) {
                    _this.hide();
                }
                _this.preventDocumentDefault = false;
            });
        }
    };
    TieredMenu.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    TieredMenu.prototype.bindDocumentResizeListener = function () {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    };
    TieredMenu.prototype.unbindDocumentResizeListener = function () {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    };
    TieredMenu.prototype.onOverlayHide = function () {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.preventDocumentDefault = false;
        this.target = null;
    };
    TieredMenu.prototype.ngOnDestroy = function () {
        if (this.popup) {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    };
    TieredMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    TieredMenu.decorators = [
        { type: Component, args: [{
                    selector: 'p-tieredMenu',
                    template: "\n        <div [ngClass]=\"{'p-tieredmenu p-component':true, 'p-tieredmenu-overlay':popup}\" [class]=\"styleClass\" [ngStyle]=\"style\"\n            [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" [@.disabled]=\"popup !== true\" \n            (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\" (click)=\"preventDocumentDefault=true\" *ngIf=\"!popup || visible\">\n            <p-tieredMenuSub [item]=\"model\" root=\"root\" [parentActive]=\"parentActive\" [baseZIndex]=\"baseZIndex\" [autoZIndex]=\"autoZIndex\"></p-tieredMenuSub>\n        </div>\n    ",
                    animations: [
                        trigger('overlayAnimation', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                                animate('{{showTransitionParams}}')
                            ]),
                            transition(':leave', [
                                animate('{{hideTransitionParams}}', style({ opacity: 0 }))
                            ])
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
    TieredMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    TieredMenu.propDecorators = {
        model: [{ type: Input }],
        popup: [{ type: Input }],
        style: [{ type: Input }],
        styleClass: [{ type: Input }],
        appendTo: [{ type: Input }],
        autoZIndex: [{ type: Input }],
        baseZIndex: [{ type: Input }],
        showTransitionOptions: [{ type: Input }],
        hideTransitionOptions: [{ type: Input }]
    };
    return TieredMenu;
}());
var TieredMenuModule = /** @class */ (function () {
    function TieredMenuModule() {
    }
    TieredMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, RouterModule, RippleModule],
                    exports: [TieredMenu, RouterModule],
                    declarations: [TieredMenu, TieredMenuSub]
                },] }
    ];
    return TieredMenuModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { TieredMenu, TieredMenuModule, TieredMenuSub };
//# sourceMappingURL=primeng-tieredmenu.js.map
