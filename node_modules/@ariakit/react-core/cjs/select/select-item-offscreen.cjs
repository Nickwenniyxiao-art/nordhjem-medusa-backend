"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _TQH4GRJ6cjs = require('../__chunks/TQH4GRJ6.cjs');


var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');


var _MAP7LWFNcjs = require('../__chunks/MAP7LWFN.cjs');
require('../__chunks/ALTUQCI3.cjs');
require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/57B3GSGZ.cjs');


var _L22B4P6Ycjs = require('../__chunks/L22B4P6Y.cjs');
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

// src/select/select-item-offscreen.tsx
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
function useSelectItemOffscreen({ store, value, ...props }) {
  const context = _4NZHMZNFcjs.useSelectScopedContext.call(void 0, );
  store = store || context;
  return _MAP7LWFNcjs.useCompositeItemOffscreen.call(void 0, { store, value, ...props });
}
var SelectItem2 = _743QABRAcjs.forwardRef.call(void 0, function SelectItem3({
  offscreenBehavior,
  offscreenRoot,
  ...props
}) {
  const { active, ref, ...rest } = useSelectItemOffscreen({
    offscreenBehavior,
    offscreenRoot,
    ...props
  });
  const allProps = { ...rest, ...props, ref: _KGFTRA3Ccjs.useMergeRefs.call(void 0, ref, props.ref) };
  if (active) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _TQH4GRJ6cjs.SelectItem, { ...allProps });
  }
  const {
    store,
    value,
    getItem,
    hideOnClick,
    setValueOnClick,
    preventScrollOnKeyDown,
    focusOnHover,
    blurOnHoverEnd,
    ...htmlProps
  } = allProps;
  const Component = _L22B4P6Ycjs.Role[TagName];
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Component, { ...htmlProps });
});



exports.SelectItem = SelectItem2; exports.useSelectItemOffscreen = useSelectItemOffscreen;
