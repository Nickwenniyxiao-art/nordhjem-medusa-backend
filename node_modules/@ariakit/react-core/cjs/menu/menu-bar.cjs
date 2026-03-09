"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _ZCQQLDPKcjs = require('../__chunks/ZCQQLDPK.cjs');
require('../__chunks/WJN3C6NM.cjs');
require('../__chunks/26FZXC26.cjs');
require('../__chunks/CZKPX6W7.cjs');
require('../__chunks/YTQONGS5.cjs');
require('../__chunks/MIBORXQW.cjs');
require('../__chunks/SDXRA2A6.cjs');
require('../__chunks/WI7QXQL7.cjs');
require('../__chunks/4JH5Q6AQ.cjs');
require('../__chunks/T3QB4FR3.cjs');
require('../__chunks/YY2UXBEB.cjs');
require('../__chunks/SS26HAQ2.cjs');




var _743QABRAcjs = require('../__chunks/743QABRA.cjs');
require('../__chunks/KGFTRA3C.cjs');
require('../__chunks/XMDZRF6Y.cjs');

// src/menu/menu-bar.tsx
var _react = require('react');
var TagName = "div";
var useMenuBar = _743QABRAcjs.createHook.call(void 0, 
  function useMenuBar2(props) {
    _react.useEffect.call(void 0, () => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "MenuBar is deprecated. Use Menubar instead.",
          "See https://ariakit.org/reference/menubar"
        );
      }
    }, []);
    return _ZCQQLDPKcjs.useMenubar.call(void 0, props);
  }
);
var MenuBar = _743QABRAcjs.forwardRef.call(void 0, function MenuBar2(props) {
  const htmlProps = useMenuBar(props);
  return _743QABRAcjs.createElement.call(void 0, TagName, htmlProps);
});



exports.MenuBar = MenuBar; exports.useMenuBar = useMenuBar;
