import { ReactNode, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import Close from "@mui/icons-material/Close";

import { usePushRender } from "./Container";

export interface AsyncConfirmProps {
  title?: ReactNode;
  message?: ReactNode;
  footer?: ReactNode;
  cancel?: string;
  accept?: string;
}

export const usePushConfirm = () => {
  const pushRender = usePushRender();

  const pushConfirm = ({
    title,
    message,
    footer,
    cancel,
    accept,
  }: AsyncConfirmProps) => {
    return pushRender<boolean>((open, pop, onExited) => {
      const cancelHandle = () => pop(false);
      return (
        <Dialog
          open={open}
          onClose={cancelHandle}
          TransitionProps={{ onExited }}
        >
          {title && <DialogTitle>{title}</DialogTitle>}
          <Box position="absolute" top={0} right={0}>
            <IconButton onClick={cancelHandle}>
              <Close />
            </IconButton>
          </Box>
          {message && (
            <DialogContent>
              <DialogContentText>{message}</DialogContentText>
            </DialogContent>
          )}

          <DialogActions>
            {footer}
            <Button onClick={cancelHandle}>{cancel || "Cancel"}</Button>
            <Button variant="contained" autoFocus onClick={() => pop(true)}>
              {accept || "Accept"}
            </Button>
          </DialogActions>
        </Dialog>
      );
    });
  };

  return useCallback(pushConfirm, [pushRender]);
};
