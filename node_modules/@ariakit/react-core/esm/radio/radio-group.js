"use client";
import {
  RadioScopedContextProvider,
  useRadioProviderContext
} from "../__chunks/QOZ6WMRY.js";
import {
  useComposite
} from "../__chunks/ZMWF7ASR.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useWrapElement
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/radio/radio-group.tsx
import { invariant } from "@ariakit/core/utils/misc";
import { jsx } from "react/jsx-runtime";
var TagName = "div";
var useRadioGroup = createHook(
  function useRadioGroup2({ store, ...props }) {
    const context = useRadioProviderContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "RadioGroup must receive a `store` prop or be wrapped in a RadioProvider component."
    );
    props = useWrapElement(
      props,
      (element) => /* @__PURE__ */ jsx(RadioScopedContextProvider, { value: store, children: element }),
      [store]
    );
    props = {
      role: "radiogroup",
      ...props
    };
    props = useComposite({ store, ...props });
    return props;
  }
);
var RadioGroup = forwardRef(function RadioGroup2(props) {
  const htmlProps = useRadioGroup(props);
  return createElement(TagName, htmlProps);
});
export {
  RadioGroup,
  useRadioGroup
};
