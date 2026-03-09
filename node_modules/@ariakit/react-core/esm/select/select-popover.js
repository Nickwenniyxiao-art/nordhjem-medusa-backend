"use client";
import {
  useSelectList
} from "../__chunks/PFBP2CY4.js";
import {
  useSelectProviderContext
} from "../__chunks/AEGCXJZV.js";
import "../__chunks/FORDJ4GP.js";
import {
  usePopover
} from "../__chunks/KW7Z5AIL.js";
import {
  createDialogComponent
} from "../__chunks/Z32PU2LQ.js";
import "../__chunks/VJH3F6TN.js";
import "../__chunks/AOQQTIBO.js";
import "../__chunks/5M6RIVE2.js";
import "../__chunks/BFOIJXK2.js";
import "../__chunks/2F57YTN4.js";
import "../__chunks/3HM4TGWW.js";
import "../__chunks/6GXEOXGT.js";
import "../__chunks/KKITJVHA.js";
import "../__chunks/U3R3WHDK.js";
import "../__chunks/JSI7U3EA.js";
import "../__chunks/B6W4QFKS.js";
import "../__chunks/OT5RJDXG.js";
import "../__chunks/CZ4GFWYL.js";
import "../__chunks/Z5GCVBAY.js";
import "../__chunks/IGR4SXG2.js";
import "../__chunks/677M2CI3.js";
import "../__chunks/S7U6BLGA.js";
import "../__chunks/P45QRJLH.js";
import "../__chunks/3NDVDEB4.js";
import "../__chunks/AOUGVQZ3.js";
import "../__chunks/K2ZF5NU7.js";
import "../__chunks/63XF7ACK.js";
import "../__chunks/6B3RXHKP.js";
import "../__chunks/4NYSH4UO.js";
import "../__chunks/WLZ6H5FH.js";
import "../__chunks/ZMWF7ASR.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/JG4VNI52.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/select/select-popover.tsx
var TagName = "div";
var useSelectPopover = createHook(
  function useSelectPopover2({ store, alwaysVisible, ...props }) {
    const context = useSelectProviderContext();
    store = store || context;
    props = useSelectList({ store, alwaysVisible, ...props });
    props = usePopover({ store, alwaysVisible, ...props });
    return props;
  }
);
var SelectPopover = createDialogComponent(
  forwardRef(function SelectPopover2(props) {
    const htmlProps = useSelectPopover(props);
    return createElement(TagName, htmlProps);
  }),
  useSelectProviderContext
);
export {
  SelectPopover,
  useSelectPopover
};
