import { render, act } from "@testing-library/react";
import { ReactNode } from "react";
import Service from "service";
import "utils";

import App from "../App";

jest.mock("../pages", () => () => <div className="pages">Pages</div>);
jest.mock("service", () => ({ connect: jest.fn() }));
jest.mock("components/Loader/Wrapper", () => ({
  LoaderWrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const mockConnect = Service.connect as jest.Mock;

describe("App", () => {
  it("should connected service & match snapshot", async () => {
    mockConnect.mockResolvedValueOnce(true);
    const { container } = render(<App />);
    await act(() => Promise.resolve());

    expect(container.querySelector(".pages")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should empty when can not connect service", async () => {
    mockConnect.mockResolvedValueOnce(false);
    const { container } = render(<App />);
    await act(() => Promise.resolve());

    expect(container.querySelector(".pages")).not.toBeInTheDocument();
  });
});
