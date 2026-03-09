"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _4NZHMZNFcjs = require('../__chunks/4NZHMZNF.cjs');


var _WL7GZ44Rcjs = require('../__chunks/WL7GZ44R.cjs');
require('../__chunks/6GWYBIDM.cjs');
require('../__chunks/ZO6DH46K.cjs');
require('../__chunks/5BVSKVUN.cjs');
require('../__chunks/HHXD2YNZ.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/DIWKSV34.cjs');
require('../__chunks/CFNQ2EAV.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/select/select-dismiss.tsx
var TagName = "button";
var useSelectDismiss = _743QABRAcjs.createHook.call(void 0, 
  function useSelectDismiss2({ store, ...props }) {
    const context = _4NZHMZNFcjs.useSelectScopedContext.call(void 0, );
    store = store || context;
    props = _WL7GZ44Rcjs.usePopoverDismiss.call(void 0, { store, ...props });
    return props;
  }
);
var SelectDismiss = _743QABRAcjs.forwardRef.call(void 0, function SelectDismiss2(props) {
  const htmlProps = useSelectDismiss(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.SelectDismiss = SelectDismiss; exports.useSelectDismiss = useSelectDismiss;
