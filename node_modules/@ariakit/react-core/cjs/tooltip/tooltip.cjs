"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _QKNBVX3Ucjs = require('../__chunks/QKNBVX3U.cjs');


var _OYEJQSLLcjs = require('../__chunks/OYEJQSLL.cjs');
require('../__chunks/L6CLLK7R.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/J7ATZCFK.cjs');


var _ANHHZKY4cjs = require('../__chunks/ANHHZKY4.cjs');
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

// src/tooltip/tooltip.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useTooltip = _743QABRAcjs.createHook.call(void 0, 
  function useTooltip2({
    store,
    portal = true,
    gutter = 8,
    preserveTabOrder = false,
    hideOnHoverOutside = true,
    hideOnInteractOutside = true,
    ...props
  }) {
    const context = _QKNBVX3Ucjs.useTooltipProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "Tooltip must receive a `store` prop or be wrapped in a TooltipProvider component."
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _QKNBVX3Ucjs.TooltipScopedContextProvider, { value: store, children: element }),
      [store]
    );
    const role = store.useState(
      (state) => state.type === "description" ? "tooltip" : "none"
    );
    props = { role, ...props };
    props = _OYEJQSLLcjs.useHovercard.call(void 0, {
      ...props,
      store,
      portal,
      gutter,
      preserveTabOrder,
      hideOnHoverOutside(event) {
        if (_misc.isFalsyBooleanCallback.call(void 0, hideOnHoverOutside, event)) return false;
        const anchorElement = store == null ? void 0 : store.getState().anchorElement;
        if (!anchorElement) return true;
        if ("focusVisible" in anchorElement.dataset) return false;
        return true;
      },
      hideOnInteractOutside: (event) => {
        if (_misc.isFalsyBooleanCallback.call(void 0, hideOnInteractOutside, event)) return false;
        const anchorElement = store == null ? void 0 : store.getState().anchorElement;
        if (!anchorElement) return true;
        if (_dom.contains.call(void 0, anchorElement, event.target)) return false;
        return true;
      }
    });
    return props;
  }
);
var Tooltip = _ANHHZKY4cjs.createDialogComponent.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function Tooltip2(props) {
    const htmlProps = useTooltip(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  }),
  _QKNBVX3Ucjs.useTooltipProviderContext
);



exports.Tooltip = Tooltip; exports.useTooltip = useTooltip;
