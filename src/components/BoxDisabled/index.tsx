import styled from "@emotion/styled";
import Box from "@mui/material/Box";

export const BoxDisabled = styled(Box)(
  ({ disabled }: { disabled?: boolean }) =>
    disabled && { pointerEvents: "none", opacity: 0.5 }
);
