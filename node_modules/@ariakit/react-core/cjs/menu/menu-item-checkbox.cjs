"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZCFQZKRScjs = require('../__chunks/ZCFQZKRS.cjs');


var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ALTUQCI3.cjs');
require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');


var _KDJ6FXQQcjs = require('../__chunks/KDJ6FXQQ.cjs');


var _L6J77MXFcjs = require('../__chunks/L6J77MXF.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/IRJEBRAW.cjs');
require('../__chunks/HNUUQ6LR.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-item-checkbox.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var TagName = "div";
function getPrimitiveValue(value) {
  if (Array.isArray(value)) {
    return value.toString();
  }
  return value;
}
function getValue(storeValue, value, checked) {
  if (value === void 0) {
    if (Array.isArray(storeValue)) return storeValue;
    return !!checked;
  }
  const primitiveValue = getPrimitiveValue(value);
  if (!Array.isArray(storeValue)) {
    if (checked) {
      return primitiveValue;
    }
    return storeValue === primitiveValue ? false : storeValue;
  }
  if (checked) {
    if (storeValue.includes(primitiveValue)) {
      return storeValue;
    }
    return [...storeValue, primitiveValue];
  }
  return storeValue.filter((v) => v !== primitiveValue);
}
var useMenuItemCheckbox = _743QABRAcjs.createHook.call(void 0, 
  function useMenuItemCheckbox2({
    store,
    name,
    value,
    checked,
    defaultChecked: defaultCheckedProp,
    hideOnClick = false,
    ...props
  }) {
    const context = _JJQSOPYIcjs.useMenuScopedContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "MenuItemCheckbox must be wrapped in a MenuList or Menu component"
    );
    const defaultChecked = _KGFTRA3Ccjs.useInitialValue.call(void 0, defaultCheckedProp);
    _react.useEffect.call(void 0, () => {
      store == null ? void 0 : store.setValue(name, (prevValue = []) => {
        if (!defaultChecked) return prevValue;
        return getValue(prevValue, value, true);
      });
    }, [store, name, value, defaultChecked]);
    _react.useEffect.call(void 0, () => {
      if (checked === void 0) return;
      store == null ? void 0 : store.setValue(name, (prevValue) => {
        return getValue(prevValue, value, checked);
      });
    }, [store, name, value, checked]);
    const checkboxStore = _KDJ6FXQQcjs.useCheckboxStore.call(void 0, {
      value: store.useState((state) => state.values[name]),
      setValue(internalValue) {
        store == null ? void 0 : store.setValue(name, () => {
          if (checked === void 0) return internalValue;
          const nextValue = getValue(internalValue, value, checked);
          if (!Array.isArray(nextValue)) return nextValue;
          if (!Array.isArray(internalValue)) return nextValue;
          if (_misc.shallowEqual.call(void 0, internalValue, nextValue)) return internalValue;
          return nextValue;
        });
      }
    });
    props = {
      role: "menuitemcheckbox",
      ...props
    };
    props = _L6J77MXFcjs.useCheckbox.call(void 0, {
      store: checkboxStore,
      name,
      value,
      checked,
      ...props
    });
    props = _ZCFQZKRScjs.useMenuItem.call(void 0, { store, hideOnClick, ...props });
    return props;
  }
);
var MenuItemCheckbox = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function MenuItemCheckbox2(props) {
    const htmlProps = useMenuItemCheckbox(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.MenuItemCheckbox = MenuItemCheckbox; exports.useMenuItemCheckbox = useMenuItemCheckbox;
