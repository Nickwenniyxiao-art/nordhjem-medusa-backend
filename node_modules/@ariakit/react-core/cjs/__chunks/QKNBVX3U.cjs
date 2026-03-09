"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _6N7G7IZOcjs = require('./6N7G7IZO.cjs');


var _743QABRAcjs = require('./743QABRA.cjs');

// src/tooltip/tooltip-context.tsx
var ctx = _743QABRAcjs.createStoreContext.call(void 0, 
  [_6N7G7IZOcjs.HovercardContextProvider],
  [_6N7G7IZOcjs.HovercardScopedContextProvider]
);
var useTooltipContext = ctx.useContext;
var useTooltipScopedContext = ctx.useScopedContext;
var useTooltipProviderContext = ctx.useProviderContext;
var TooltipContextProvider = ctx.ContextProvider;
var TooltipScopedContextProvider = ctx.ScopedContextProvider;







exports.useTooltipContext = useTooltipContext; exports.useTooltipScopedContext = useTooltipScopedContext; exports.useTooltipProviderContext = useTooltipProviderContext; exports.TooltipContextProvider = TooltipContextProvider; exports.TooltipScopedContextProvider = TooltipScopedContextProvider;
