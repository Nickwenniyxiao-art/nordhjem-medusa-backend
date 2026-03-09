"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _5BVSKVUNcjs = require('./5BVSKVUN.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/popover/popover-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_5BVSKVUNcjs.DialogContextProvider],
  [_5BVSKVUNcjs.DialogScopedContextProvider]
);
var usePopoverContext = ctx.useContext;
var usePopoverScopedContext = ctx.useScopedContext;
var usePopoverProviderContext = ctx.useProviderContext;
var PopoverContextProvider = ctx.ContextProvider;
var PopoverScopedContextProvider = ctx.ScopedContextProvider;







exports.usePopoverContext = usePopoverContext; exports.usePopoverScopedContext = usePopoverScopedContext; exports.usePopoverProviderContext = usePopoverProviderContext; exports.PopoverContextProvider = PopoverContextProvider; exports.PopoverScopedContextProvider = PopoverScopedContextProvider;
