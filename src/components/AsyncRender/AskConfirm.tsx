import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { ReactNode, useCallback } from "react";
import { AsyncConfirmProps, usePushConfirm } from "./Confirm";

export interface AsyncAskConfirmProps
  extends Omit<AsyncConfirmProps, "footer"> {
  shouldAsk: { get(): boolean; set(value: boolean): void };
  notAsk?: ReactNode;
}

export const usePushAskConfirm = () => {
  const showConfirm = usePushConfirm();

  const pushAsk = async ({ shouldAsk, ...props }: AsyncAskConfirmProps) => {
    if (!shouldAsk.get()) return true;

    const isAccept = await showConfirm({
      ...props,
      footer: (
        <FormControlLabel
          control={
            <Checkbox
              onChange={({ target }) => shouldAsk.set(!target.checked)}
            />
          }
          label={props.notAsk || "Don't ask again"}
        />
      ),
    });
    if (isAccept) return true;
    shouldAsk.set(true);
    return false;
  };

  return useCallback(pushAsk, [showConfirm]);
};
