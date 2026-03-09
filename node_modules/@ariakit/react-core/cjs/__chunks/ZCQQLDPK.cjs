"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WJN3C6NMcjs = require('./WJN3C6NM.cjs');


var _26FZXC26cjs = require('./26FZXC26.cjs');


var _YTQONGS5cjs = require('./YTQONGS5.cjs');




var _743QABRAcjs = require('./743QABRA.cjs');


var _KGFTRA3Ccjs = require('./KGFTRA3C.cjs');

// src/menubar/menubar.tsx
var _jsxruntime = require('react/jsx-runtime');
var TagName = "div";
var useMenubar = _743QABRAcjs.createHook.call(void 0, 
  function useMenubar2({
    store: storeProp,
    composite = true,
    orientation: orientationProp,
    virtualFocus,
    focusLoop,
    rtl,
    ...props
  }) {
    const context = _WJN3C6NMcjs.useMenubarProviderContext.call(void 0, );
    storeProp = storeProp || context;
    const store = _26FZXC26cjs.useMenubarStore.call(void 0, {
      store: storeProp,
      orientation: orientationProp,
      virtualFocus,
      focusLoop,
      rtl
    });
    const orientation = store.useState(
      (state) => !composite || state.orientation === "both" ? void 0 : state.orientation
    );
    props = _KGFTRA3Ccjs.useWrapElement.call(void 0, 
      props,
      (element) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _WJN3C6NMcjs.MenubarScopedContextProvider, { value: store, children: element }),
      [store]
    );
    if (composite) {
      props = {
        role: "menubar",
        "aria-orientation": orientation,
        ...props
      };
    }
    props = _YTQONGS5cjs.useComposite.call(void 0, { store, composite, ...props });
    return props;
  }
);
var Menubar = _743QABRAcjs.forwardRef.call(void 0, function Menubar2(props) {
  const htmlProps = useMenubar(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});




exports.useMenubar = useMenubar; exports.Menubar = Menubar;
