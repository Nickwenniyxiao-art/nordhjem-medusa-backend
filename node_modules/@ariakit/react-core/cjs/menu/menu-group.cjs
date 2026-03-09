"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _5GHA7P5Fcjs = require('../__chunks/5GHA7P5F.cjs');
require('../__chunks/62RIM242.cjs');
require('../__chunks/XRATBFDX.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-group.tsx
var TagName = "div";
var useMenuGroup = _743QABRAcjs.createHook.call(void 0, 
  function useMenuGroup2(props) {
    props = _5GHA7P5Fcjs.useCompositeGroup.call(void 0, props);
    return props;
  }
);
var MenuGroup = _743QABRAcjs.forwardRef.call(void 0, function MenuGroup2(props) {
  const htmlProps = useMenuGroup(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuGroup = MenuGroup; exports.useMenuGroup = useMenuGroup;
