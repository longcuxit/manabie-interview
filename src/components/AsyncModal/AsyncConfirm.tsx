import { useCallback } from "react";
import { Button, Modal } from "react-bootstrap";

import { usePushAsyncModal } from "./AsyncModal";
import { AsyncConfirmProps } from "./type";

export const useAsyncConfirm = () => {
  const showModal = usePushAsyncModal();
  return useCallback(
    ({ title, message, footer, cancel, accept }: AsyncConfirmProps) => {
      return showModal<true>(
        (pop) => (
          <>
            {title && (
              <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
              </Modal.Header>
            )}

            {message && <Modal.Body>{message}</Modal.Body>}

            <Modal.Footer>
              {footer}
              <Button variant="secondary" onClick={() => pop()}>
                {cancel || "Cancel"}
              </Button>
              <Button variant="primary" onClick={() => pop(true)}>
                {accept || "Accept"}
              </Button>
            </Modal.Footer>
          </>
        ),
        { centered: true }
      );
    },
    [showModal]
  );
};
