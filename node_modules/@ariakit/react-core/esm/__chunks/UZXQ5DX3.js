"use client";
import {
  HovercardContextProvider,
  HovercardScopedContextProvider
} from "./PTRWAQFT.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/tooltip/tooltip-context.tsx
var ctx = createStoreContext(
  [HovercardContextProvider],
  [HovercardScopedContextProvider]
);
var useTooltipContext = ctx.useContext;
var useTooltipScopedContext = ctx.useScopedContext;
var useTooltipProviderContext = ctx.useProviderContext;
var TooltipContextProvider = ctx.ContextProvider;
var TooltipScopedContextProvider = ctx.ScopedContextProvider;

export {
  useTooltipContext,
  useTooltipScopedContext,
  useTooltipProviderContext,
  TooltipContextProvider,
  TooltipScopedContextProvider
};
