"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _LITMCKMJcjs = require('../__chunks/LITMCKMJ.cjs');
require('../__chunks/AI6VIQ5F.cjs');
require('../__chunks/OISF5P4T.cjs');
require('../__chunks/6AOESUW6.cjs');
require('../__chunks/JLMLKTUB.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-heading.tsx
var TagName = "h1";
var useMenuHeading = _743QABRAcjs.createHook.call(void 0, 
  function useMenuHeading2(props) {
    props = _LITMCKMJcjs.useHovercardHeading.call(void 0, props);
    return props;
  }
);
var MenuHeading = _743QABRAcjs.forwardRef.call(void 0, function MenuHeading2(props) {
  const htmlProps = useMenuHeading(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuHeading = MenuHeading; exports.useMenuHeading = useMenuHeading;
