"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _SIFHEXFDcjs = require('../__chunks/SIFHEXFD.cjs');


var _RAME3APWcjs = require('../__chunks/RAME3APW.cjs');
require('../__chunks/WS3AS5PB.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/UUGJI255.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');





var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/toolbar/toolbar-input.tsx
var TagName = "input";
var useToolbarInput = _743QABRAcjs.createHook.call(void 0, 
  function useToolbarInput2({ store, ...props }) {
    const context = _RAME3APWcjs.useToolbarContext.call(void 0, );
    store = store || context;
    props = _SIFHEXFDcjs.useToolbarItem.call(void 0, { store, ...props });
    return props;
  }
);
var ToolbarInput = _743QABRAcjs.memo.call(void 0, 
  _743QABRAcjs.forwardRef.call(void 0, function ToolbarInput2(props) {
    const htmlProps = useToolbarInput(props);
    return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
  })
);



exports.ToolbarInput = ToolbarInput; exports.useToolbarInput = useToolbarInput;
