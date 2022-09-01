import { render, act } from "@testing-library/react";
import { ReactNode } from "react";
import Service from "service";

import App from "../App";

jest.mock("../pages", () => () => <div data-testid="pages" />);
jest.mock("service", () => ({ connect: jest.fn() }));
jest.mock("components/Loader/Wrapper", () => ({
  LoaderWrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const mockConnect = Service.connect as jest.Mock;

describe("App", () => {
  it("should connected service", async () => {
    mockConnect.mockReturnValue(Promise.resolve(true));
    const { getByTestId } = render(<App />);
    await act(() => Promise.resolve());

    expect(getByTestId("pages")).toBeInTheDocument();
  });

  it("should empty when can not connect service", async () => {
    mockConnect.mockResolvedValue(false);
    const { getByRole } = render(<App />);
    await act(() => Promise.resolve());

    expect(getByRole("alert")).toBeInTheDocument();
  });
});
