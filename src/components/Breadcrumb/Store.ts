import { ReactNode } from "react";
import { Store } from "utils";

export interface BreadcrumbProps {
  path?: string;
  onClick?: () => void;
  label: ReactNode;
}
export type UpdateAction = (item?: BreadcrumbProps) => UpdateAction;

const initialState: BreadcrumbProps[] = [];

export const store = new Store(
  initialState,
  ({ set, get }) =>
    (item: BreadcrumbProps) => {
      set((items) => [...items, item]);
      console.log("add", get());
      const update: UpdateAction = (newItem) => {
        if (newItem) {
          set((items) => {
            items[items.indexOf(item)] = newItem;
            item = newItem;
            return [...items];
          });
        } else {
          set((items) => {
            items.splice(items.indexOf(item), 1);
            return [...items];
          });
        }
        return update;
      };
      return update;
    }
);
