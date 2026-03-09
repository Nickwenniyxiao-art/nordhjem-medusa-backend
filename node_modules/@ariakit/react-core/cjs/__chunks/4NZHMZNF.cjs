"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');



var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/select/select-context.tsx
var _react = require('react');
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_ZO6DH46Kcjs.PopoverContextProvider, _WI7QXQL7cjs.CompositeContextProvider],
  [_ZO6DH46Kcjs.PopoverScopedContextProvider, _WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useSelectContext = ctx.useContext;
var useSelectScopedContext = ctx.useScopedContext;
var useSelectProviderContext = ctx.useProviderContext;
var SelectContextProvider = ctx.ContextProvider;
var SelectScopedContextProvider = ctx.ScopedContextProvider;
var SelectItemCheckedContext = _react.createContext.call(void 0, false);
var SelectHeadingContext = _react.createContext.call(void 0, null);









exports.useSelectContext = useSelectContext; exports.useSelectScopedContext = useSelectScopedContext; exports.useSelectProviderContext = useSelectProviderContext; exports.SelectContextProvider = SelectContextProvider; exports.SelectScopedContextProvider = SelectScopedContextProvider; exports.SelectItemCheckedContext = SelectItemCheckedContext; exports.SelectHeadingContext = SelectHeadingContext;
