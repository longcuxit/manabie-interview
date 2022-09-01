import { renderHook } from "utils/testting";
import { useAuth } from "../Auth";
import Service from "service";
import { AuthModel } from "models/User";
import { act } from "@testing-library/react";

jest.mock("service", () => ({ login: jest.fn() }));

const mockLogin = Service.login as jest.Mock;

describe("stores/Auth:", () => {
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

    expect(localStorage.getItem("AUTH")).toBe("null");
  });
});
