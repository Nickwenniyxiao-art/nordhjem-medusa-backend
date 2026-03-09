"use client";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider
} from "./AVVXDJMZ.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/tab/tab-context.tsx
var ctx = createStoreContext(
  [CompositeContextProvider],
  [CompositeScopedContextProvider]
);
var useTabContext = ctx.useContext;
var useTabScopedContext = ctx.useScopedContext;
var useTabProviderContext = ctx.useProviderContext;
var TabContextProvider = ctx.ContextProvider;
var TabScopedContextProvider = ctx.ScopedContextProvider;

export {
  useTabContext,
  useTabScopedContext,
  useTabProviderContext,
  TabContextProvider,
  TabScopedContextProvider
};
