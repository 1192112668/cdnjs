// Generated by CoffeeScript 2.0.0-beta4
(function() {
  // ------------------------------------------------------------------------
  // 變數與常數設置
  // ------------------------------------------------------------------------

  // 模組名稱。
  var ClassName, EVENT_NAMESPACE, Error, Event, MODULE_NAMESPACE, NAME, Selector, Settings;

  NAME = 'checkbox';

  // 模組事件鍵名。
  EVENT_NAMESPACE = `.${NAME}`;

  // 模組命名空間。
  MODULE_NAMESPACE = `module-${NAME}`;

  // 模組設定。
  Settings = {
    // 消音所有提示，甚至是錯誤訊息。
    silent: false,
    // 顯示除錯訊息。
    debug: true,
    // 監聽 DOM 結構異動並自動重整快取。
    observeChanges: true,
    // 當核取方塊被更改勾選狀態時所呼叫的函式。
    onChange: () => {},
    // 當核取方塊被勾選時所呼叫的函式。
    onChecked: () => {},
    // 當核取方塊被取消勾選時所呼叫的函式。
    onUnchecked: () => {},
    // 當核取方塊被勾選時所呼叫的函式，如果這個函式回傳 `false` 將會阻止勾選動作。
    beforeChecked: () => {
      return true;
    },
    // 當核取方塊被取消勾選時所呼叫的函式，如果這個函式回傳 `false` 將會阻止取消勾選動作。
    beforeUnchecked: () => {
      return true;
    },
    // 當核取方塊被啟用時所呼叫的函式。
    onEnable: () => {},
    // 當核取方塊被停用時所呼叫的函式。
    onDisable: () => {}
  };

  // 事件名稱。
  Event = {
    CHECKED: `checked${EVENT_NAMESPACE}`,
    UNCHECKED: `unchecked${EVENT_NAMESPACE}`,
    BEFORE_CHECKED: `beforeChecked${EVENT_NAMESPACE}`,
    BEFORE_UNCHECKED: `beforeUnchecked${EVENT_NAMESPACE}`,
    ENABLE: `enable${EVENT_NAMESPACE}`,
    DISABLE: `disable${EVENT_NAMESPACE}`,
    CHANGE: `change${EVENT_NAMESPACE}`,
    CLICK: `click${EVENT_NAMESPACE}`
  };

  // 樣式名稱。
  ClassName = {
    DISABLED: 'disabled',
    RADIO: 'radio'
  };

  // 選擇器名稱。
  Selector = {
    INPUT: 'input',
    INPUT_RADIO: 'input[type="radio"]',
    INPUT_CHECKBOX: 'input[type="checkbox"]',
    INPUT_RADIO_NAME: (name) => {
      return `input[type='radio'][name='${name}']`;
    }
  };

  // 錯誤訊息。
  Error = {};

  // ------------------------------------------------------------------------
  // 模組註冊
  // ------------------------------------------------------------------------
  ts.register({NAME, MODULE_NAMESPACE, Error, Settings}, ({$allModules, $this, element, debug, settings}) => {
    var $input, inputElement, module;
    // ------------------------------------------------------------------------
    // 區域變數
    // ------------------------------------------------------------------------
    $input = $this.find(Selector.INPUT);
    inputElement = $input.get();
    // ------------------------------------------------------------------------
    // 模組定義
    // ------------------------------------------------------------------------
    return module = {
      toggle: () => {
        debug('切換核取方塊', element);
        if (module.is.checked() && module.is.checkbox()) {
          return module.uncheck();
        } else {
          return module.check();
        }
      },
      check: () => {
        debug('勾選核取方塊', element);
        if (!module.trigger.beforeChecked()) {
          return;
        }
        if (module.is.radio()) {
          module.uncheckAll();
        }
        module.trigger.check();
        return module.set.checked(true);
      },
      uncheck: () => {
        debug('取消勾選核取方塊', element);
        if (!module.trigger.beforeUnchecked()) {
          return;
        }
        module.trigger.uncheck();
        return module.set.checked(false);
      },
      uncheckAll: (name) => {
        return ts(Selector.INPUT_RADIO_NAME(module.get.name())).each(function() {
          return ts(this).parent().checkbox('uncheck');
        });
      },
      disable: () => {
        debug('停用核取方塊', element);
        module.trigger.disable();
        return module.set.disable(true);
      },
      enable: () => {
        debug('啟用核取方塊', element);
        module.trigger.enable();
        return module.set.disable(false);
      },
      set: {
        checked: (bool) => {
          return $input.prop('checked', bool);
        },
        disable: (bool) => {
          if (bool) {
            $this.addClass(ClassName.DISABLED);
          } else {
            $this.removeClass(ClassName.DISABLED);
          }
          return $input.prop('disabled', bool);
        }
      },
      is: {
        disable: () => {
          return $input.prop('disabled');
        },
        enable: () => {
          return !$input.prop('disabled');
        },
        checked: () => {
          return $input.prop('checked');
        },
        unchecked: () => {
          return !$input.prop('checked');
        },
        radio: () => {
          return $this.hasClass(ClassName.RADIO);
        },
        checkbox: () => {
          return !$this.hasClass(ClassName.RADIO);
        }
      },
      get: {
        name: () => {
          return $input.attr('name');
        }
      },
      trigger: {
        check: () => {
          return $this.trigger(Event.CHECKED, inputElement).trigger(Event.CHANGE, inputElement);
        },
        uncheck: () => {
          return $this.trigger(Event.UNCHECKED, inputElement).trigger(Event.CHANGE, inputElement);
        },
        disable: () => {
          return $this.trigger(Event.DISABLE, inputElement);
        },
        enable: () => {
          return $this.trigger(Event.ENABLE, inputElement);
        },
        beforeChecked: () => {
          return settings.beforeChecked.call(inputElement);
        },
        beforeUnchecked: () => {
          return settings.beforeUnchecked.call(inputElement);
        }
      },
      bind: {
        events: () => {
          $this.on(Event.CLICK, () => {
            debug('發生 CLICK 事件', element);
            if (module.is.enable()) {
              return module.toggle();
            }
          });
          $this.on(Event.CHECKED, (event, context) => {
            debug('發生 CHECKED 事件', element);
            return settings.onChecked.call(context, event);
          });
          $this.on(Event.UNCHECKED, (event, context) => {
            debug('發生 UNCHECKED 事件', element);
            return settings.onUnchecked.call(context, event);
          });
          $this.on(Event.ENABLE, (event, context) => {
            debug('發生 ENABLE 事件', element);
            return settings.onEnable.call(context, event);
          });
          $this.on(Event.DISABLE, (event, context) => {
            debug('發生 DISABLE 事件', element);
            return settings.onDisable.call(context, event);
          });
          return $this.on(Event.CHANGE, (event, context) => {
            debug('發生 CHANGE 事件', element);
            return settings.onChange.call(context, event);
          });
        }
      },
      // ------------------------------------------------------------------------
      // 基礎方法
      // ------------------------------------------------------------------------
      initialize: () => {
        debug('初始化核取方塊', element);
        return module.bind.events();
      },
      instantiate: () => {
        return debug('實例化核取方塊', element);
      },
      refresh: () => {
        $input = $this.find(Selector.INPUT);
        inputElement = $input.get();
        return $allModules;
      },
      destroy: () => {
        debug('摧毀核取方塊', element);
        $this.removeData(MODULE_NAMESPACE).off(EVENT_NAMESPACE);
        return $allModules;
      }
    };
  });

}).call(this);
