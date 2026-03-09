"use client";
import {
  useTagContext
} from "../__chunks/XSIEPKGA.js";
import {
  useCompositeItem
} from "../__chunks/WZWDIE3S.js";
import "../__chunks/5VQZOHHZ.js";
import "../__chunks/Z2O3VLAQ.js";
import "../__chunks/AVVXDJMZ.js";
import "../__chunks/PZ3OL7I2.js";
import "../__chunks/U6HHPQDW.js";
import "../__chunks/SWN3JYXT.js";
import {
  useStoreState
} from "../__chunks/Q5W46E73.js";
import "../__chunks/SMPCIMZM.js";
import {
  createElement,
  createHook,
  forwardRef
} from "../__chunks/GWSL6KNJ.js";
import {
  useBooleanEvent,
  useEvent,
  useMergeRefs
} from "../__chunks/KPHZR4MB.js";
import "../__chunks/YXGXYGQX.js";

// src/tag/tag-input.tsx
import { toArray } from "@ariakit/core/utils/array";
import {
  getTextboxSelection,
  setSelectionRange
} from "@ariakit/core/utils/dom";
import { getInputType } from "@ariakit/core/utils/events";
import { invariant } from "@ariakit/core/utils/misc";
import { UndoManager } from "@ariakit/core/utils/undo";
var TagName = "input";
var DEFAULT_DELIMITER = ["\n", ";", ",", /\s/];
function getDelimiters(delimiter, defaultDelimiter = DEFAULT_DELIMITER) {
  const finalDelimiter = delimiter === void 0 ? defaultDelimiter : delimiter;
  if (!finalDelimiter) return [];
  return toArray(finalDelimiter);
}
function splitValueByDelimiter(value, delimiters) {
  for (const delimiter of delimiters) {
    let match = value.match(delimiter);
    while ((match == null ? void 0 : match.index) === 0) {
      value = value.slice(match[0].length);
      match = value.match(delimiter);
    }
    if (!match) continue;
    return value.split(delimiter);
  }
  return [];
}
var useTagInput = createHook(
  function useTagInput2({
    store,
    tabbable = true,
    delimiter,
    addValueOnPaste = true,
    addValueOnChange = true,
    setValueOnChange = true,
    removeOnBackspace = true,
    ...props
  }) {
    const context = useTagContext();
    store = store || context;
    invariant(
      store,
      process.env.NODE_ENV !== "production" && "TagInput must receive a `store` prop or be wrapped in a TagProvider component."
    );
    const value = useStoreState(store, "value");
    const onPasteProp = props.onPaste;
    const addValueOnPasteProp = useBooleanEvent(addValueOnPaste);
    const onPaste = useEvent((event) => {
      onPasteProp == null ? void 0 : onPasteProp(event);
      if (event.defaultPrevented) return;
      const text = event.clipboardData.getData("text");
      const delimiters = getDelimiters(delimiter);
      const values = splitValueByDelimiter(text.trim(), delimiters).map((value2) => value2.trim()).filter((value2) => value2 !== "");
      const eventWithValues = Object.assign(event, { values });
      if (!addValueOnPasteProp(eventWithValues)) return;
      if (!values.length) return;
      event.preventDefault();
      for (const tagValue of values) {
        store.addValue(tagValue);
      }
    });
    const onChangeProp = props.onChange;
    const setValueOnChangeProp = useBooleanEvent(setValueOnChange);
    const addValueOnChangeProp = useBooleanEvent(addValueOnChange);
    const onChange = useEvent((event) => {
      onChangeProp == null ? void 0 : onChangeProp(event);
      if (event.defaultPrevented) return;
      if (!store) return;
      const { value: prevValue } = store.getState();
      const inputType = getInputType(event);
      const currentTarget = event.currentTarget;
      const { start, end } = getTextboxSelection(currentTarget);
      const { value: value2 } = currentTarget;
      if (setValueOnChangeProp(event)) {
        UndoManager.execute(() => {
          store.setValue(value2);
          queueMicrotask(() => {
            setSelectionRange(currentTarget, start, end);
          });
          if (value2 === prevValue) return;
          return () => store.setValue(prevValue);
        }, inputType);
      }
      const isTrailingCaret = start === end && start === value2.length;
      if (isTrailingCaret) {
        const delimiters = getDelimiters(delimiter);
        let values = splitValueByDelimiter(value2, delimiters);
        const trailingvalue = values.pop() || "";
        values = values.map((value3) => value3.trim()).filter((value3) => value3 !== "");
        const eventWithValues = Object.assign(event, { values });
        if (values.length && addValueOnChangeProp(eventWithValues)) {
          event.preventDefault();
          for (const tagValue of values) {
            store.addValue(tagValue);
          }
          UndoManager.execute(() => {
            store.setValue(trailingvalue);
            if (trailingvalue === prevValue) return;
            return () => store.setValue(prevValue);
          }, inputType);
        }
      }
    });
    const onKeyDownProp = props.onKeyDown;
    const removeOnBackspaceProp = useBooleanEvent(removeOnBackspace);
    const onKeyDown = useEvent((event) => {
      onKeyDownProp == null ? void 0 : onKeyDownProp(event);
      if (event.defaultPrevented) return;
      if (event.key === "Backspace" && removeOnBackspaceProp(event)) {
        const { start, end } = getTextboxSelection(event.currentTarget);
        const isLeadingCaret = start === end && start === 0;
        if (!isLeadingCaret) return;
        store.setValues((values) => {
          if (!values.length) return values;
          return values.slice(0, -1);
        });
      }
    });
    props = {
      value,
      ...props,
      ref: useMergeRefs(store.setInputElement, props.ref),
      onPaste,
      onChange,
      onKeyDown
    };
    props = useCompositeItem({ store, tabbable, ...props });
    return props;
  }
);
var TagInput = forwardRef(function TagInput2(props) {
  const htmlProps = useTagInput(props);
  return createElement(TagName, htmlProps);
});
export {
  TagInput,
  useTagInput
};
