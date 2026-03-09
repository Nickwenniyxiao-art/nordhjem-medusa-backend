"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZCFQZKRScjs = require('../__chunks/ZCFQZKRS.cjs');



var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');
require('../__chunks/6N7G7IZO.cjs');


var _Z6JUQCZEcjs = require('../__chunks/Z6JUQCZE.cjs');
require('../__chunks/567HKB5N.cjs');
require('../__chunks/ALTUQCI3.cjs');
require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');



var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-item-radio.tsx
var _misc = require('@ariakit/core/utils/misc');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
function getValue(prevValue, value, checked) {
  if (checked === void 0) return prevValue;
  if (checked) return value;
  return prevValue;
}
var useMenuItemRadio = _743QABRAcjs.createHook.call(void 0, 
  function useMenuItemRadio2({
    store,
    name,
    value,
    checked,
    onChange: onChangeProp,
    hideOnClick = false,
    ...props
  }) {
    const context = _JJQSOPYIcjs.useMenuScopedContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "MenuItemRadio must be wrapped in a MenuList or Menu component"
    );
    const defaultChecked = _KGFTRA3Ccjs.useInitialValue.call(void 0, props.defaultChecked);
    _react.useEffect.call(void 0, () => {
      store == null ? void 0 : store.setValue(name, (prevValue = false) => {
        return getValue(prevValue, value, defaultChecked);
      });
    }, [store, name, value, defaultChecked]);
    _react.useEffect.call(void 0, () => {
      if (checked === void 0) return;
      store == null ? void 0 : store.setValue(name, (prevValue) => {
        return getValue(prevValue, value, checked);
      });
    }, [store, name, value, checked]);
    const isChecked = store.useState((state) => state.values[name] === value);
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _JJQSOPYIcjs.MenuItemCheckedContext.Provider, { value: !!isChecked, children: element }),
      [isChecked]
    );
    props = {
      role: "menuitemradio",
      ...props
    };
    props = _Z6JUQCZEcjs.useRadio.call(void 0, {
      name,
      value,
      checked: isChecked,
      onChange(event) {
        onChangeProp == null ? void 0 : onChangeProp(event);
        if (event.defaultPrevented) return;
        const element = event.currentTarget;
        store == null ? void 0 : store.setValue(name, (prevValue) => {
          return getValue(prevValue, value, checked != null ? checked : element.checked);
        });
      },
      ...props
    });
    props = _ZCFQZKRScjs.useMenuItem.call(void 0, { store, hideOnClick, ...props });
    return props;
  }
);
var MenuItemRadio = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function MenuItemRadio2(props) {
    const htmlProps = useMenuItemRadio(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.MenuItemRadio = MenuItemRadio; exports.useMenuItemRadio = useMenuItemRadio;
