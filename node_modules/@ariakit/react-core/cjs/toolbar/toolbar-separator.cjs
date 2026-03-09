"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _RAME3APWcjs = require('../__chunks/RAME3APW.cjs');


var _OAFCIJ5Xcjs = require('../__chunks/OAFCIJ5X.cjs');
require('../__chunks/VQNB6TQG.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/toolbar/toolbar-separator.tsx
var TagName = "hr";
var useToolbarSeparator = _743QABRAcjs.createHook.call(void 0, 
  function useToolbarSeparator2({ store, ...props }) {
    const context = _RAME3APWcjs.useToolbarContext.call(void 0, );
    store = store || context;
    props = _OAFCIJ5Xcjs.useCompositeSeparator.call(void 0, { store, ...props });
    return props;
  }
);
var ToolbarSeparator = _743QABRAcjs.forwardRef.call(void 0, function ToolbarSeparator2(props) {
  const htmlProps = useToolbarSeparator(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.ToolbarSeparator = ToolbarSeparator; exports.useToolbarSeparator = useToolbarSeparator;
