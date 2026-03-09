"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _ZO6DH46Kcjs = require('./ZO6DH46K.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/hovercard/hovercard-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_ZO6DH46Kcjs.PopoverContextProvider],
  [_ZO6DH46Kcjs.PopoverScopedContextProvider]
);
var useHovercardContext = ctx.useContext;
var useHovercardScopedContext = ctx.useScopedContext;
var useHovercardProviderContext = ctx.useProviderContext;
var HovercardContextProvider = ctx.ContextProvider;
var HovercardScopedContextProvider = ctx.ScopedContextProvider;







exports.useHovercardContext = useHovercardContext; exports.useHovercardScopedContext = useHovercardScopedContext; exports.useHovercardProviderContext = useHovercardProviderContext; exports.HovercardContextProvider = HovercardContextProvider; exports.HovercardScopedContextProvider = HovercardScopedContextProvider;
