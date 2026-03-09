"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/menubar/menubar-context.tsx
var _react = require('react');
var menubar = _743QABRAcjs.createStoreContext.call(void 0, 
  [_WI7QXQL7cjs.CompositeContextProvider],
  [_WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useMenubarContext = menubar.useContext;
var useMenubarScopedContext = menubar.useScopedContext;
var useMenubarProviderContext = menubar.useProviderContext;
var MenubarContextProvider = menubar.ContextProvider;
var MenubarScopedContextProvider = menubar.ScopedContextProvider;
var MenuItemCheckedContext = _react.createContext.call(void 0, 
  void 0
);








exports.useMenubarContext = useMenubarContext; exports.useMenubarScopedContext = useMenubarScopedContext; exports.useMenubarProviderContext = useMenubarProviderContext; exports.MenubarContextProvider = MenubarContextProvider; exports.MenubarScopedContextProvider = MenubarScopedContextProvider; exports.MenuItemCheckedContext = MenuItemCheckedContext;
