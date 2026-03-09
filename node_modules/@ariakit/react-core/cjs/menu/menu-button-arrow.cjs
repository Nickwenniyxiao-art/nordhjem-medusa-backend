"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _PCBYE2BJcjs = require('../__chunks/PCBYE2BJ.cjs');


var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');
require('../__chunks/6N7G7IZO.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-button-arrow.tsx
var TagName = "span";
var useMenuButtonArrow = _743QABRAcjs.createHook.call(void 0, 
  function useMenuButtonArrow2({ store, ...props }) {
    const context = _JJQSOPYIcjs.useMenuContext.call(void 0, );
    store = store || context;
    props = _PCBYE2BJcjs.usePopoverDisclosureArrow.call(void 0, { store, ...props });
    return props;
  }
);
var MenuButtonArrow = _743QABRAcjs.forwardRef.call(void 0, function MenuButtonArrow2(props) {
  const htmlProps = useMenuButtonArrow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuButtonArrow = MenuButtonArrow; exports.useMenuButtonArrow = useMenuButtonArrow;
