"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _QKNBVX3Ucjs = require('../__chunks/QKNBVX3U.cjs');


var _V73NZLLBcjs = require('../__chunks/V73NZLLB.cjs');
require('../__chunks/PLY2V46G.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/YY2UXBEB.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tooltip/tooltip-arrow.tsx
var _misc = require('@ariakit/core/utils/misc');
var TagName = "div";
var useTooltipArrow = _743QABRAcjs.createHook.call(void 0, 
  function useTooltipArrow2({ store, size = 16, ...props }) {
    const context = _QKNBVX3Ucjs.useTooltipContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TooltipArrow must be wrapped in a Tooltip component."
    );
    props = _V73NZLLBcjs.usePopoverArrow.call(void 0, { store, size, ...props });
    return props;
  }
);
var TooltipArrow = _743QABRAcjs.forwardRef.call(void 0, function TooltipArrow2(props) {
  const htmlProps = useTooltipArrow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TooltipArrow = TooltipArrow; exports.useTooltipArrow = useTooltipArrow;
