"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _JJQSOPYIcjs = require('../__chunks/JJQSOPYI.cjs');
require('../__chunks/WJN3C6NM.cjs');


var _V7ISXTDOcjs = require('../__chunks/V7ISXTDO.cjs');
require('../__chunks/WL7GZ44R.cjs');
require('../__chunks/6N7G7IZO.cjs');
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

// src/menu/menu-dismiss.tsx
var TagName = "button";
var useMenuDismiss = _743QABRAcjs.createHook.call(void 0, 
  function useMenuDismiss2({ store, ...props }) {
    const context = _JJQSOPYIcjs.useMenuScopedContext.call(void 0, );
    store = store || context;
    props = _V7ISXTDOcjs.useHovercardDismiss.call(void 0, { store, ...props });
    return props;
  }
);
var MenuDismiss = _743QABRAcjs.forwardRef.call(void 0, function MenuDismiss2(props) {
  const htmlProps = useMenuDismiss(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuDismiss = MenuDismiss; exports.useMenuDismiss = useMenuDismiss;
