"use client";
import {
  useMenuStore
} from "../__chunks/62CEUOYM.js";
import {
  MenuContextProvider
} from "../__chunks/Z4X7TRJU.js";
import "../__chunks/2DUOQURA.js";
import "../__chunks/ECBEZ4YM.js";
import "../__chunks/PTRWAQFT.js";
import "../__chunks/B6FLPFJM.js";
import "../__chunks/IQYAUKXT.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import "../__chunks/GVAFFF2B.js";
import "../__chunks/CVCFNOHX.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/menu/menu-provider.tsx
import { jsx } from "react/jsx-runtime";
function MenuProvider(props = {}) {
  const store = useMenuStore(props);
  return /* @__PURE__ */ jsx(MenuContextProvider, { value: store, children: props.children });
}
export {
  MenuProvider
};
