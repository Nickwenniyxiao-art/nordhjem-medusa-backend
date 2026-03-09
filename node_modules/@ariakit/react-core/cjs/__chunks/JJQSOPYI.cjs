"use strict";Object.defineProperty(exports, "__esModule", {value: true});





var _WJN3C6NMcjs = require('./WJN3C6NM.cjs');



var _6N7G7IZOcjs = require('./6N7G7IZO.cjs');



var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/menu/menu-context.tsx
var _react = require('react');
var menu = _743QABRAcjs.createStoreContext.call(void 0, 
  [_WI7QXQL7cjs.CompositeContextProvider, _6N7G7IZOcjs.HovercardContextProvider],
  [_WI7QXQL7cjs.CompositeScopedContextProvider, _6N7G7IZOcjs.HovercardScopedContextProvider]
);
var useMenuContext = menu.useContext;
var useMenuScopedContext = menu.useScopedContext;
var useMenuProviderContext = menu.useProviderContext;
var MenuContextProvider = menu.ContextProvider;
var MenuScopedContextProvider = menu.ScopedContextProvider;
var useMenuBarContext = _WJN3C6NMcjs.useMenubarContext;
var useMenuBarScopedContext = _WJN3C6NMcjs.useMenubarScopedContext;
var useMenuBarProviderContext = _WJN3C6NMcjs.useMenubarProviderContext;
var MenuBarContextProvider = _WJN3C6NMcjs.MenubarContextProvider;
var MenuBarScopedContextProvider = _WJN3C6NMcjs.MenubarScopedContextProvider;
var MenuItemCheckedContext = _react.createContext.call(void 0, 
  void 0
);













exports.useMenuContext = useMenuContext; exports.useMenuScopedContext = useMenuScopedContext; exports.useMenuProviderContext = useMenuProviderContext; exports.MenuContextProvider = MenuContextProvider; exports.MenuScopedContextProvider = MenuScopedContextProvider; exports.useMenuBarContext = useMenuBarContext; exports.useMenuBarScopedContext = useMenuBarScopedContext; exports.useMenuBarProviderContext = useMenuBarProviderContext; exports.MenuBarContextProvider = MenuBarContextProvider; exports.MenuBarScopedContextProvider = MenuBarScopedContextProvider; exports.MenuItemCheckedContext = MenuItemCheckedContext;
