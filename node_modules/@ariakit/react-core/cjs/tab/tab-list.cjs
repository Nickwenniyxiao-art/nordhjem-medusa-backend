"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _L5UNQIH6cjs = require('../__chunks/L5UNQIH6.cjs');


var _YTQONGS5cjs = require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/tab/tab-list.tsx
var _misc = require('@ariakit/core/utils/misc');
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useTabList = _743QABRAcjs.createHook.call(void 0, 
  function useTabList2({ store, ...props }) {
    const context = _L5UNQIH6cjs.useTabProviderContext.call(void 0, );
    store = store || context;
    _misc.invariant.call(void 0, 
      store,
      process.env.NODE_ENV !== "production" && "TabList must receive a `store` prop or be wrapped in a TabProvider component."
    );
    const orientation = store.useState(
      (state) => state.orientation === "both" ? void 0 : state.orientation
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _L5UNQIH6cjs.TabScopedContextProvider, { value: store, children: element }),
      [store]
    );
    if (store.composite) {
      props = {
        focusable: false,
        ...props
      };
    }
    props = {
      role: "tablist",
      "aria-orientation": orientation,
      ...props
    };
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, ...props });
    return props;
  }
);
var TabList = _743QABRAcjs.forwardRef.call(void 0, function TabList2(props) {
  const htmlProps = useTabList(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.TabList = TabList; exports.useTabList = useTabList;
