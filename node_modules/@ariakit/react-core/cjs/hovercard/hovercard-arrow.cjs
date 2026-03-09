"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _V73NZLLBcjs = require('../__chunks/V73NZLLB.cjs');
require('../__chunks/PLY2V46G.cjs');


var _6N7G7IZOcjs = require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/YY2UXBEB.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/hovercard/hovercard-arrow.tsx
var TagName = "div";
var useHovercardArrow = _743QABRAcjs.createHook.call(void 0, 
  function useHovercardArrow2({ store, ...props }) {
    const context = _6N7G7IZOcjs.useHovercardContext.call(void 0, );
    store = store || context;
    props = _V73NZLLBcjs.usePopoverArrow.call(void 0, { store, ...props });
    return props;
  }
);
var HovercardArrow = _743QABRAcjs.forwardRef.call(void 0, function HovercardArrow2(props) {
  const htmlProps = useHovercardArrow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.HovercardArrow = HovercardArrow; exports.useHovercardArrow = useHovercardArrow;
