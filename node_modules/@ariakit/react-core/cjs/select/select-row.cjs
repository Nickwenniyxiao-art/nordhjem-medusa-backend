"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');


var _AT2XHUYNcjs = require('../__chunks/AT2XHUYN.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-row.tsx
var _dom = require('@ariakit/core/utils/dom');
var _misc = require('@ariakit/core/utils/misc');
var TagName = "div";
var useSelectRow = _743QABRAcjs.createHook.call(void 0, 
  function useSelectRow2({ store, ...props }) {
    const context = _4NZHMZNFcjs.useSelectContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "SelectRow must be wrapped in a SelectList or SelectPopover component"
    );
    const listElement = store.useState("listElement");
    const popupRole = _dom.getPopupRole.call(void 0, listElement);
    const role = popupRole === "grid" ? "row" : "presentation";
    props = { role, ...props };
    props = _AT2XHUYNcjs.useCompositeRow.call(void 0, { store, ...props });
    return props;
  }
);
var SelectRow = _743QABRAcjs.forwardRef.call(void 0, function SelectRow2(props) {
  const htmlProps = useSelectRow(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.SelectRow = SelectRow; exports.useSelectRow = useSelectRow;
