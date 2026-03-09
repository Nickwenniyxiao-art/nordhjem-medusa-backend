"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _MAP7LWFNcjs = require('../__chunks/MAP7LWFN.cjs');


var _4UZ6ECXXcjs = require('../__chunks/4UZ6ECXX.cjs');
require('../__chunks/ALTUQCI3.cjs');
require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/57B3GSGZ.cjs');


var _L22B4P6Ycjs = require('../__chunks/L22B4P6Y.cjs');
require('../__chunks/UUGJI255.cjs');



var _MLRWKUIEcjs = require('../__chunks/MLRWKUIE.cjs');
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

// src/combobox/combobox-item-offscreen.tsx
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var itemRoleByPopupRole = {
  menu: "menuitem",
  listbox: "option",
  tree: "treeitem"
};
function getItemRole(popupRole) {
  var _a;
  const key = popupRole;
  return (_a = itemRoleByPopupRole[key]) != null ? _a : "option";
}
function useComboboxItemOffscreen({ store, value, ...props }) {
  const context = _MLRWKUIEcjs.useComboboxScopedContext.call(void 0, );
  store = store || context;
  const offscreenProps = _MAP7LWFNcjs.useCompositeItemOffscreen.call(void 0, { store, value, ...props });
  const popupRole = _react.useContext.call(void 0, _MLRWKUIEcjs.ComboboxListRoleContext);
  if (!offscreenProps.active) {
    return {
      ...offscreenProps,
      role: getItemRole(popupRole)
    };
  }
  return offscreenProps;
}
var ComboboxItem2 = _743QABRAcjs.forwardRef.call(void 0, function ComboboxItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useComboboxItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _4UZ6ECXXcjs.ComboboxItem, { ...allProps });
  }
  const {
    store,
    value,
    hideOnClick,
    setValueOnClick,
    selectValueOnClick,
    resetValueOnSelect,
    focusOnHover,
    blurOnHoverEnd,
    moveOnKeyPress,
    getItem,
    ...htmlProps
  } = allProps;
  const Component = _L22B4P6Ycjs.Role[TagName];
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Component, { ...htmlProps });
});



exports.ComboboxItem = ComboboxItem2; exports.useComboboxItemOffscreen = useComboboxItemOffscreen;
