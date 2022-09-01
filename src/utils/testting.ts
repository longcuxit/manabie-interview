import { render, RenderResult } from "@testing-library/react";
import { FC, createElement, ReactNode } from "react";

export type RenderHookResult<T> = { result: { current: T } } & RenderResult;
export type RenderHookProps<T> = {
  wrapper?: FC<{ children?: ReactNode }>;
  inner?: FC<{ current: T }>;
};

export function renderHook<V>(
  hook: () => V,
  { wrapper, inner }: RenderHookProps<V> = {}
): RenderHookResult<V> {
  const result = {} as RenderHookResult<V>["result"];
  const children = createElement(() => {
    result.current = hook();
    return inner ? createElement(inner, result) : null;
  });
  const tree = (
    wrapper ? render(createElement(wrapper, {}, children)) : render(children)
  ) as RenderHookResult<V>;
  tree.result = result;
  return tree;
}
