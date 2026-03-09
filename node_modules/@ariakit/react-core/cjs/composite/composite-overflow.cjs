"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _J7ATZCFKcjs = require('../__chunks/J7ATZCFK.cjs');
require('../__chunks/ANHHZKY4.cjs');
require('../__chunks/KHJERDK3.cjs');
require('../__chunks/UI5KWBYV.cjs');
require('../__chunks/L634CRNJ.cjs');
require('../__chunks/VGI2PE2B.cjs');
require('../__chunks/ZPT6IQKO.cjs');
require('../__chunks/FBPPLGNN.cjs');
require('../__chunks/W32FX7DM.cjs');
require('../__chunks/OLXEI7QX.cjs');
require('../__chunks/6GRO3ZM4.cjs');
require('../__chunks/TXUJ5BOC.cjs');
require('../__chunks/H2FXMMBN.cjs');
require('../__chunks/5AGCRCKV.cjs');
require('../__chunks/JLMLKTUB.cjs');
require('../__chunks/LCWSLOYU.cjs');
require('../__chunks/V7JASX7S.cjs');
require('../__chunks/56NPFF7P.cjs');
require('../__chunks/GASMO7Y4.cjs');
require('../__chunks/GX66UERW.cjs');
require('../__chunks/26P4PLHI.cjs');
require('../__chunks/YVOQ2BCB.cjs');
require('../__chunks/4SKDRUBR.cjs');
require('../__chunks/AQ2LO7WV.cjs');
require('../__chunks/3ZDSDKC6.cjs');
require('../__chunks/ZXVQQIOS.cjs');
require('../__chunks/HQBHIWZX.cjs');
require('../__chunks/L22B4P6Y.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/composite/composite-overflow.tsx
var TagName = "div";
var hiddenStyle = {
  opacity: 0,
  pointerEvents: "none"
};
var useCompositeOverflow = _743QABRAcjs.createHook.call(void 0, function useCompositeOverflow2({
  store,
  wrapperProps: wrapperPropsProp,
  portal = false,
  ...props
}) {
  const onFocusProp = props.onFocus;
  const onFocus = _KGFTRA3Ccjs.useEvent.call(void 0, (event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    store.show();
  });
  const mounted = store.useState("mounted");
  const getStyle = (styleProp) => mounted ? styleProp : { ...hiddenStyle, ...styleProp };
  const wrapperProps = {
    ...wrapperPropsProp,
    style: getStyle(wrapperPropsProp == null ? void 0 : wrapperPropsProp.style)
  };
  props = {
    role: "presentation",
    ...props,
    onFocus
  };
  props = _J7ATZCFKcjs.usePopover.call(void 0, {
    store,
    focusable: false,
    alwaysVisible: true,
    wrapperProps,
    portal,
    ...props
  });
  return props;
});
var CompositeOverflow = _743QABRAcjs.forwardRef.call(void 0, function CompositeOverflow2(props) {
  const htmlProps = useCompositeOverflow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.CompositeOverflow = CompositeOverflow; exports.useCompositeOverflow = useCompositeOverflow;
