"use client";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider
} from "./AVVXDJMZ.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/toolbar/toolbar-context.tsx
var ctx = createStoreContext(
  [CompositeContextProvider],
  [CompositeScopedContextProvider]
);
var useToolbarContext = ctx.useContext;
var useToolbarScopedContext = ctx.useScopedContext;
var useToolbarProviderContext = ctx.useProviderContext;
var ToolbarContextProvider = ctx.ContextProvider;
var ToolbarScopedContextProvider = ctx.ScopedContextProvider;

export {
  useToolbarContext,
  useToolbarScopedContext,
  useToolbarProviderContext,
  ToolbarContextProvider,
  ToolbarScopedContextProvider
};
