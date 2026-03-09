"use client";
import {
  MenubarContextProvider
} from "./2DUOQURA.js";
import {
  useMenubarStore
} from "./6H6PBGDB.js";

// src/menubar/menubar-provider.tsx
import { jsx } from "react/jsx-runtime";
function MenubarProvider(props = {}) {
  const store = useMenubarStore(props);
  return /* @__PURE__ */ jsx(MenubarContextProvider, { value: store, children: props.children });
}

export {
  MenubarProvider
};
