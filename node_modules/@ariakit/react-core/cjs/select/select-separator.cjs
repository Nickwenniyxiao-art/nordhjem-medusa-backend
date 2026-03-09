"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');


var _OAFCIJ5Xcjs = require('../__chunks/OAFCIJ5X.cjs');
require('../__chunks/VQNB6TQG.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-separator.tsx
var TagName = "hr";
var useSelectSeparator = _743QABRAcjs.createHook.call(void 0, 
  function useSelectSeparator2({ store, ...props }) {
    const context = _4NZHMZNFcjs.useSelectContext.call(void 0, );
    store = store || context;
    props = _OAFCIJ5Xcjs.useCompositeSeparator.call(void 0, { store, ...props });
    return props;
  }
);
var SelectSeparator = _743QABRAcjs.forwardRef.call(void 0, function SelectSeparator2(props) {
  const htmlProps = useSelectSeparator(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.SelectSeparator = SelectSeparator; exports.useSelectSeparator = useSelectSeparator;
