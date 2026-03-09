"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/tab/tab-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_WI7QXQL7cjs.CompositeContextProvider],
  [_WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useTabContext = ctx.useContext;
var useTabScopedContext = ctx.useScopedContext;
var useTabProviderContext = ctx.useProviderContext;
var TabContextProvider = ctx.ContextProvider;
var TabScopedContextProvider = ctx.ScopedContextProvider;







exports.useTabContext = useTabContext; exports.useTabScopedContext = useTabScopedContext; exports.useTabProviderContext = useTabProviderContext; exports.TabContextProvider = TabContextProvider; exports.TabScopedContextProvider = TabScopedContextProvider;
