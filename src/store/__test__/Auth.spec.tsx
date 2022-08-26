import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../Auth";

import Service from "service";
import { AuthModel } from "models/User";

jest.mock("service", () => ({ login: jest.fn() }));

const mockLogin = Service.login as jest.Mock;

describe("stores/Auth:", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation((call: any) => (call(), 1));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should login/logout", async () => {
    const { result } = renderHook(useAuth);

    const fakeAuth: AuthModel = { accessToken: "token", refreshToken: "token" };

    mockLogin.mockImplementation(() => fakeAuth);

    expect(localStorage.getItem("AUTH")).toBe("null");

    await act(() => result.current[1].login("username", "password"));

    expect(mockLogin).toBeCalledTimes(1);
    expect(mockLogin).toBeCalledWith("username", "password");

    expect(result.current[0].auth).toBe(fakeAuth);
    expect(localStorage.getItem("AUTH")).not.toBe("null");

    await act(async () => result.current[1].logout());

    expect(result.current[0].auth).toBeNull();
    expect(localStorage.getItem("AUTH")).toBe("null");
  });
});
