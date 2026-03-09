"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');


var _V73NZLLBcjs = require('../__chunks/V73NZLLB.cjs');
require('../__chunks/PLY2V46G.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-arrow.tsx
var TagName = "div";
var useMenuArrow = _743QABRAcjs.createHook.call(void 0, 
  function useMenuArrow2({ store, ...props }) {
    const context = _JJQSOPYIcjs.useMenuContext.call(void 0, );
    store = store || context;
    return _V73NZLLBcjs.usePopoverArrow.call(void 0, { store, ...props });
  }
);
var MenuArrow = _743QABRAcjs.forwardRef.call(void 0, function MenuArrow2(props) {
  const htmlProps = useMenuArrow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuArrow = MenuArrow; exports.useMenuArrow = useMenuArrow;
