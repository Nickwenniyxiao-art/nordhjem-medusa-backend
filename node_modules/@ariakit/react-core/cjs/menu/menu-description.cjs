"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _FAUOOJGNcjs = require('../__chunks/FAUOOJGN.cjs');
require('../__chunks/LZIHTTN3.cjs');
require('../__chunks/TIQJZGMO.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-description.tsx
var TagName = "p";
var useMenuDescription = _743QABRAcjs.createHook.call(void 0, 
  function useMenuDescription2(props) {
    props = _FAUOOJGNcjs.useHovercardDescription.call(void 0, props);
    return props;
  }
);
var MenuDescription = _743QABRAcjs.forwardRef.call(void 0, function MenuDescription2(props) {
  const htmlProps = useMenuDescription(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuDescription = MenuDescription; exports.useMenuDescription = useMenuDescription;
