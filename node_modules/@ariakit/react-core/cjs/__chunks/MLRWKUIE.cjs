"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');



var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/combobox/combobox-context.tsx
var _react = require('react');
var ComboboxListRoleContext = _react.createContext.call(void 0, 
  void 0
);
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_ZO6DH46Kcjs.PopoverContextProvider, _WI7QXQL7cjs.CompositeContextProvider],
  [_ZO6DH46Kcjs.PopoverScopedContextProvider, _WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useComboboxContext = ctx.useContext;
var useComboboxScopedContext = ctx.useScopedContext;
var useComboboxProviderContext = ctx.useProviderContext;
var ComboboxContextProvider = ctx.ContextProvider;
var ComboboxScopedContextProvider = ctx.ScopedContextProvider;
var ComboboxItemValueContext = _react.createContext.call(void 0, 
  void 0
);
var ComboboxItemCheckedContext = _react.createContext.call(void 0, false);










exports.ComboboxListRoleContext = ComboboxListRoleContext; exports.useComboboxContext = useComboboxContext; exports.useComboboxScopedContext = useComboboxScopedContext; exports.useComboboxProviderContext = useComboboxProviderContext; exports.ComboboxContextProvider = ComboboxContextProvider; exports.ComboboxScopedContextProvider = ComboboxScopedContextProvider; exports.ComboboxItemValueContext = ComboboxItemValueContext; exports.ComboboxItemCheckedContext = ComboboxItemCheckedContext;
