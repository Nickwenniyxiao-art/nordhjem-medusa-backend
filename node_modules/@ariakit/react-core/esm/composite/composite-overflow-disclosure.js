"use client";
import {
  usePopoverDisclosure
} from "../__chunks/RFRKSHIZ.js";
import "../__chunks/4POTBZ2J.js";
import "../__chunks/APVORPDK.js";
import "../__chunks/NDVACHQI.js";
import {
  useCompositeItem
} from "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/JMU4N4M5.js";
import "../__chunks/A62MDFCW.js";
import "../__chunks/LVDQFHCH.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/HMKTUWOU.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useEvent,
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/composite/composite-overflow-disclosure.ts
import { sync } from "@ariakit/core/utils/store";
import { useEffect, useRef, useState } from "react";
var TagName = "button";
var useCompositeOverflowDisclosure = createHook(function useCompositeOverflowDisclosure2({ store, ...props }) {
  const ref = useRef(null);
  const [shouldRegisterItem, setShouldRegisterItem] = useState(false);
  useEffect(() => {
    return sync(store, ["disclosureElement"], () => {
      store.setDisclosureElement(ref.current);
    });
  }, [store]);
  const onFocusProp = props.onFocus;
  const onFocus = useEvent((event) => {
    onFocusProp == null ? void 0 : onFocusProp(event);
    if (event.defaultPrevented) return;
    setShouldRegisterItem(true);
  });
  const onBlurProp = props.onBlur;
  const onBlur = useEvent((event) => {
    onBlurProp == null ? void 0 : onBlurProp(event);
    if (event.defaultPrevented) return;
    setShouldRegisterItem(false);
  });
  props = {
    "aria-hidden": !shouldRegisterItem,
    ...props,
    ref: useMergeRefs(props.ref, ref),
    onFocus,
    onBlur
  };
  props = useCompositeItem({ ...props, shouldRegisterItem });
  props = usePopoverDisclosure({ store, ...props });
  return props;
});
var CompositeOverflowDisclosure = forwardRef(
  function CompositeOverflowDisclosure2(props) {
    const htmlProps = useCompositeOverflowDisclosure(props);
    return createElement(TagName, htmlProps);
  }
);
export {
  CompositeOverflowDisclosure,
  useCompositeOverflowDisclosure
};
