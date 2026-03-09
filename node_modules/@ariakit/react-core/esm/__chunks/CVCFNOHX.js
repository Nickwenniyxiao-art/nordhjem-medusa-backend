"use client";
import {
  PopoverContextProvider,
  PopoverScopedContextProvider
} from "./JMU4N4M5.js";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider
} from "./AVVXDJMZ.js";
import {
  createStoreContext
} from "./GWSL6KNJ.js";

// src/combobox/combobox-context.tsx
import { createContext } from "react";
var ComboboxListRoleContext = createContext(
  void 0
);
var ctx = createStoreContext(
  [PopoverContextProvider, CompositeContextProvider],
  [PopoverScopedContextProvider, CompositeScopedContextProvider]
);
var useComboboxContext = ctx.useContext;
var useComboboxScopedContext = ctx.useScopedContext;
var useComboboxProviderContext = ctx.useProviderContext;
var ComboboxContextProvider = ctx.ContextProvider;
var ComboboxScopedContextProvider = ctx.ScopedContextProvider;
var ComboboxItemValueContext = createContext(
  void 0
);
var ComboboxItemCheckedContext = createContext(false);

export {
  ComboboxListRoleContext,
  useComboboxContext,
  useComboboxScopedContext,
  useComboboxProviderContext,
  ComboboxContextProvider,
  ComboboxScopedContextProvider,
  ComboboxItemValueContext,
  ComboboxItemCheckedContext
};
