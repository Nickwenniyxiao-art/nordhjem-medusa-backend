"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _V2BJN5UQcjs = require('../__chunks/V2BJN5UQ.cjs');



var _RAME3APWcjs = require('../__chunks/RAME3APW.cjs');
require('../__chunks/CZKPX6W7.cjs');


var _YTQONGS5cjs = require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');


var _KGFTRA3Ccjs = require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/toolbar/toolbar.tsx
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useToolbar = _743QABRAcjs.createHook.call(void 0, 
  function useToolbar2({
    store: storeProp,
    orientation: orientationProp,
    virtualFocus,
    focusLoop,
    rtl,
    ...props
  }) {
    const context = _RAME3APWcjs.useToolbarProviderContext.call(void 0, );
    storeProp = storeProp || context;
    const store = _V2BJN5UQcjs.useToolbarStore.call(void 0, {
      store: storeProp,
      orientation: orientationProp,
      virtualFocus,
      focusLoop,
      rtl
    });
    const orientation = store.useState(
      (state) => state.orientation === "both" ? void 0 : state.orientation
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _RAME3APWcjs.ToolbarScopedContextProvider, { value: store, children: element }),
      [store]
    );
    props = {
      role: "toolbar",
      "aria-orientation": orientation,
      ...props
    };
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, ...props });
    return props;
  }
);
var Toolbar = _743QABRAcjs.forwardRef.call(void 0, function Toolbar2(props) {
  const htmlProps = useToolbar(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.Toolbar = Toolbar; exports.useToolbar = useToolbar;
