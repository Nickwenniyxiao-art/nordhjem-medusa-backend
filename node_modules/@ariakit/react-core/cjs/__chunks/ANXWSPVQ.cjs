"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('./4NZHMZNF.cjs');


var _PCBYE2BJcjs = require('./PCBYE2BJ.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');

// src/select/select-arrow.tsx
var TagName = "span";
var useSelectArrow = _743QABRAcjs.createHook.call(void 0, 
  function useSelectArrow2({ store, ...props }) {
    const context = _4NZHMZNFcjs.useSelectContext.call(void 0, );
    store = store || context;
    props = _PCBYE2BJcjs.usePopoverDisclosureArrow.call(void 0, { store, ...props });
    return props;
  }
);
var SelectArrow = _743QABRAcjs.forwardRef.call(void 0, function SelectArrow2(props) {
  const htmlProps = useSelectArrow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useSelectArrow = useSelectArrow; exports.SelectArrow = SelectArrow;
