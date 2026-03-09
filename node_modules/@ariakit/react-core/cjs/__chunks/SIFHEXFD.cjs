"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _RAME3APWcjs = require('./RAME3APW.cjs');


var _WS3AS5PBcjs = require('./WS3AS5PB.cjs');





var _743QABRAcjs = require('./743QABRA.cjs');

// src/toolbar/toolbar-item.tsx
var TagName = "button";
var useToolbarItem = _743QABRAcjs.createHook.call(void 0, 
  function useToolbarItem2({ store, ...props }) {
    const context = _RAME3APWcjs.useToolbarContext.call(void 0, );
    store = store || context;
    props = _WS3AS5PBcjs.useCompositeItem.call(void 0, { store, ...props });
    return props;
  }
);
var ToolbarItem = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function ToolbarItem2(props) {
    const htmlProps = useToolbarItem(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);




exports.useToolbarItem = useToolbarItem; exports.ToolbarItem = ToolbarItem;
