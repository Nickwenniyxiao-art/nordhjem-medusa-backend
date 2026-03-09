"use client";
import {
  PopoverContextProvider,
  PopoverScopedContextProvider
} from "./JMU4N4M5.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/hovercard/hovercard-context.tsx
var ctx = createStoreContext(
  [PopoverContextProvider],
  [PopoverScopedContextProvider]
);
var useHovercardContext = ctx.useContext;
var useHovercardScopedContext = ctx.useScopedContext;
var useHovercardProviderContext = ctx.useProviderContext;
var HovercardContextProvider = ctx.ContextProvider;
var HovercardScopedContextProvider = ctx.ScopedContextProvider;

export {
  useHovercardContext,
  useHovercardScopedContext,
  useHovercardProviderContext,
  HovercardContextProvider,
  HovercardScopedContextProvider
};
