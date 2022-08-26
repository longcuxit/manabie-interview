import { render } from "@testing-library/react";
import { AuthModel } from "models/User";
import { MemoryRouter } from "react-router-dom";

import client from "utils/axios";
import { useAuth } from "store/Auth";
import Pages from "../index";

jest.mock("store/Auth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("utils/axios", () => ({
  interceptors: { request: { use: jest.fn(), eject: jest.fn() } },
}));

jest.mock("../Login", () => () => <>PageLogin</>);

jest.mock("../Todos", () => () => <>PageTodos</>);

const fakeAuth: AuthModel = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
};

const mockUseAuth = useAuth as jest.Mock;

describe("page routes:", () => {
  test("should to Login page", () => {
    mockUseAuth.mockReturnValue([{}]);
    localStorage.setItem("AUTH", "null");
    const wrapper = render(
      <MemoryRouter>
        <Pages />
      </MemoryRouter>
    );
    expect(wrapper.container).toHaveTextContent("PageLogin");
  });

  test("should to Todos page", () => {
    mockUseAuth.mockReturnValue([{ auth: fakeAuth }]);

    const use = client.interceptors.request.use as jest.Mock;
    const wrapper = render(
      <MemoryRouter>
        <Pages />
      </MemoryRouter>
    );
    expect(use).toBeCalled();
    expect(wrapper.container).toHaveTextContent("PageTodos");

    expect(use.mock.calls[0][0]({ headers: {} }).headers.Authorization).toBe(
      "Bear accessToken"
    );
  });
});
