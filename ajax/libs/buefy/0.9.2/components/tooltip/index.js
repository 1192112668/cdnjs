/*! Buefy v0.9.2 | MIT License | github.com/buefy/buefy */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Tooltip = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var config = {
    defaultContainerElement: null,
    defaultIconPack: 'mdi',
    defaultIconComponent: null,
    defaultIconPrev: 'chevron-left',
    defaultIconNext: 'chevron-right',
    defaultLocale: undefined,
    defaultDialogConfirmText: null,
    defaultDialogCancelText: null,
    defaultSnackbarDuration: 3500,
    defaultSnackbarPosition: null,
    defaultToastDuration: 2000,
    defaultToastPosition: null,
    defaultNotificationDuration: 2000,
    defaultNotificationPosition: null,
    defaultTooltipType: 'is-primary',
    defaultTooltipDelay: null,
    defaultInputAutocomplete: 'on',
    defaultDateFormatter: null,
    defaultDateParser: null,
    defaultDateCreator: null,
    defaultTimeCreator: null,
    defaultDayNames: null,
    defaultMonthNames: null,
    defaultFirstDayOfWeek: null,
    defaultUnselectableDaysOfWeek: null,
    defaultTimeFormatter: null,
    defaultTimeParser: null,
    defaultModalCanCancel: ['escape', 'x', 'outside', 'button'],
    defaultModalScroll: null,
    defaultDatepickerMobileNative: true,
    defaultTimepickerMobileNative: true,
    defaultNoticeQueue: true,
    defaultInputHasCounter: true,
    defaultTaginputHasCounter: true,
    defaultUseHtml5Validation: true,
    defaultDropdownMobileModal: true,
    defaultFieldLabelPosition: null,
    defaultDatepickerYearsRange: [-100, 10],
    defaultDatepickerNearbyMonthDays: true,
    defaultDatepickerNearbySelectableMonthDays: false,
    defaultDatepickerShowWeekNumber: false,
    defaultDatepickerMobileModal: true,
    defaultTrapFocus: true,
    defaultButtonRounded: false,
    defaultCarouselInterval: 3500,
    defaultTabsExpanded: false,
    defaultTabsAnimated: true,
    defaultTabsType: null,
    defaultStatusIcon: true,
    defaultProgrammaticPromise: false,
    defaultLinkTags: ['a', 'button', 'input', 'router-link', 'nuxt-link', 'n-link', 'RouterLink', 'NuxtLink', 'NLink'],
    defaultImageWebpFallback: null,
    defaultImageLazy: true,
    defaultImageResponsive: true,
    defaultImageRatio: null,
    defaultImageSrcsetFormatter: null,
    customIconPacks: null
  };

  function removeElement(el) {
    if (typeof el.remove !== 'undefined') {
      el.remove();
    } else if (typeof el.parentNode !== 'undefined' && el.parentNode !== null) {
      el.parentNode.removeChild(el);
    }
  }
  function createAbsoluteElement(el) {
    var root = document.createElement('div');
    root.style.position = 'absolute';
    root.style.left = '0px';
    root.style.top = '0px';
    var wrapper = document.createElement('div');
    root.appendChild(wrapper);
    wrapper.appendChild(el);
    document.body.appendChild(root);
    return root;
  }

  var script = {
    name: 'BTooltip',
    props: {
      active: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: function _default() {
          return config.defaultTooltipType;
        }
      },
      label: String,
      delay: {
        type: Number,
        default: function _default() {
          return config.defaultTooltipDelay;
        }
      },
      position: {
        type: String,
        default: 'is-top',
        validator: function validator(value) {
          return ['is-top', 'is-bottom', 'is-left', 'is-right'].indexOf(value) > -1;
        }
      },
      triggers: {
        type: Array,
        default: function _default() {
          return ['hover'];
        }
      },
      always: Boolean,
      square: Boolean,
      dashed: Boolean,
      multilined: Boolean,
      size: {
        type: String,
        default: 'is-medium'
      },
      appendToBody: Boolean,
      animated: {
        type: Boolean,
        default: true
      },
      animation: {
        type: String,
        default: 'fade'
      },
      contentClass: String,
      autoClose: {
        type: [Array, Boolean],
        default: true
      }
    },
    data: function data() {
      return {
        isActive: false,
        style: {},
        timer: null,
        _bodyEl: undefined // Used to append to body

      };
    },
    computed: {
      rootClasses: function rootClasses() {
        return ['b-tooltip', this.type, this.position, this.size, {
          'is-square': this.square,
          'is-always': this.always,
          'is-multiline': this.multilined,
          'is-dashed': this.dashed
        }];
      },
      newAnimation: function newAnimation() {
        return this.animated ? this.animation : undefined;
      }
    },
    watch: {
      isActive: function isActive(value) {
        if (this.appendToBody) {
          this.updateAppendToBody();
        }
      }
    },
    methods: {
      updateAppendToBody: function updateAppendToBody() {
        var tooltip = this.$refs.tooltip;
        var trigger = this.$refs.trigger;

        if (tooltip && trigger) {
          // update wrapper tooltip
          var tooltipEl = this.$data._bodyEl.children[0];
          tooltipEl.classList.forEach(function (item) {
            return tooltipEl.classList.remove(item);
          });

          if (this.$vnode && this.$vnode.data && this.$vnode.data.staticClass) {
            tooltipEl.classList.add(this.$vnode.data.staticClass);
          }

          this.rootClasses.forEach(function (item) {
            if (_typeof(item) === 'object') {
              for (var key in item) {
                if (item[key]) {
                  tooltipEl.classList.add(key);
                }
              }
            } else {
              tooltipEl.classList.add(item);
            }
          });
          tooltipEl.style.width = "".concat(trigger.clientWidth, "px");
          tooltipEl.style.height = "".concat(trigger.clientHeight, "px");
          var rect = trigger.getBoundingClientRect();
          var top = rect.top + window.scrollY;
          var left = rect.left + window.scrollX;
          var wrapper = this.$data._bodyEl;
          wrapper.style.position = 'absolute';
          wrapper.style.top = "".concat(top, "px");
          wrapper.style.left = "".concat(left, "px");
          wrapper.style.zIndex = this.isActive || this.always ? '99' : '-1';
        }
      },
      onClick: function onClick() {
        var _this = this;

        if (this.triggers.indexOf('click') < 0) return; // if not active, toggle after clickOutside event
        // this fixes toggling programmatic

        this.$nextTick(function () {
          setTimeout(function () {
            return _this.open();
          });
        });
      },
      onHover: function onHover() {
        if (this.triggers.indexOf('hover') < 0) return;
        this.open();
      },
      onContextMenu: function onContextMenu() {
        if (this.triggers.indexOf('contextmenu') < 0) return;
        this.open();
      },
      onFocus: function onFocus() {
        if (this.triggers.indexOf('focus') < 0) return;
        this.open();
      },
      open: function open() {
        var _this2 = this;

        if (this.delay) {
          this.timer = setTimeout(function () {
            _this2.isActive = true;
            _this2.timer = null;
          }, this.delay);
        } else {
          this.isActive = true;
        }
      },
      close: function close() {
        if (typeof this.autoClose === 'boolean') {
          this.isActive = !this.autoClose;
          if (this.autoClose && this.timer) clearTimeout(this.timer);
        }
      },

      /**
      * Close tooltip if clicked outside.
      */
      clickedOutside: function clickedOutside(event) {
        if (this.isActive) {
          if (Array.isArray(this.autoClose)) {
            if (this.autoClose.indexOf('outside') >= 0) {
              if (!this.isInWhiteList(event.target)) this.isActive = false;
            } else if (this.autoClose.indexOf('inside') >= 0) {
              if (this.isInWhiteList(event.target)) this.isActive = false;
            }
          }
        }
      },

      /**
       * Keypress event that is bound to the document
       */
      keyPress: function keyPress(_ref) {
        var key = _ref.key;

        if (this.isActive && (key === 'Escape' || key === 'Esc')) {
          if (Array.isArray(this.autoClose)) {
            if (this.autoClose.indexOf('escape') >= 0) this.isActive = false;
          }
        }
      },

      /**
      * White-listed items to not close when clicked.
      */
      isInWhiteList: function isInWhiteList(el) {
        if (el === this.$refs.content) return true; // All chidren from content

        if (this.$refs.content !== undefined) {
          var children = this.$refs.content.querySelectorAll('*');
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;

              if (el === child) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        return false;
      }
    },
    mounted: function mounted() {
      if (this.appendToBody && typeof window !== 'undefined') {
        this.$data._bodyEl = createAbsoluteElement(this.$refs.content);
        this.updateAppendToBody();
      }
    },
    created: function created() {
      if (typeof window !== 'undefined') {
        document.addEventListener('click', this.clickedOutside);
        document.addEventListener('keyup', this.keyPress);
      }
    },
    beforeDestroy: function beforeDestroy() {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', this.clickedOutside);
        document.removeEventListener('keyup', this.keyPress);
      }

      if (this.appendToBody) {
        removeElement(this.$data._bodyEl);
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{ref:"tooltip",class:_vm.rootClasses},[_c('transition',{attrs:{"name":_vm.newAnimation}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.active && (_vm.isActive || _vm.always)),expression:"active && (isActive || always)"}],ref:"content",class:['tooltip-content', _vm.contentClass],style:(_vm.style)},[(_vm.label)?[_vm._v(_vm._s(_vm.label))]:(_vm.$slots.content)?[_vm._t("content")]:_vm._e()],2)]),_c('div',{ref:"trigger",staticClass:"tooltip-trigger",on:{"click":_vm.onClick,"contextmenu":function($event){$event.preventDefault();return _vm.onContextMenu($event)},"mouseenter":_vm.onHover,"!focus":function($event){return _vm.onFocus($event)},"mouseleave":_vm.close}},[_vm._t("default")],2)],1)};
  var __vue_staticRenderFns__ = [];

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Tooltip = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  var use = function use(plugin) {
    if (typeof window !== 'undefined' && window.Vue) {
      window.Vue.use(plugin);
    }
  };
  var registerComponent = function registerComponent(Vue, component) {
    Vue.component(component.name, component);
  };

  var Plugin = {
    install: function install(Vue) {
      registerComponent(Vue, Tooltip);
    }
  };
  use(Plugin);

  exports.BTooltip = Tooltip;
  exports.default = Plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
