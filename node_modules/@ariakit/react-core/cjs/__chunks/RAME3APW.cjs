"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _WI7QXQL7cjs = require('./WI7QXQL7.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/toolbar/toolbar-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_WI7QXQL7cjs.CompositeContextProvider],
  [_WI7QXQL7cjs.CompositeScopedContextProvider]
);
var useToolbarContext = ctx.useContext;
var useToolbarScopedContext = ctx.useScopedContext;
var useToolbarProviderContext = ctx.useProviderContext;
var ToolbarContextProvider = ctx.ContextProvider;
var ToolbarScopedContextProvider = ctx.ScopedContextProvider;







exports.useToolbarContext = useToolbarContext; exports.useToolbarScopedContext = useToolbarScopedContext; exports.useToolbarProviderContext = useToolbarProviderContext; exports.ToolbarContextProvider = ToolbarContextProvider; exports.ToolbarScopedContextProvider = ToolbarScopedContextProvider;
