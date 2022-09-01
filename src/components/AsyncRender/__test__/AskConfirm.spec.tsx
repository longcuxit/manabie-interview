import { act, fireEvent } from "@testing-library/react";
import { Completer, createLocalStorage } from "utils";
import { renderHook } from "utils/testting";
import { usePushAskConfirm } from "../AskConfirm";
import { AsyncRenderContainer } from "../Container";

import { usePushConfirm } from "../Confirm";
import { useEffect, useState } from "react";

jest.mock("../Confirm", () => ({ usePushConfirm: jest.fn() }));

const mockUsePushConfirm = usePushConfirm as jest.Mock;

const askStorage = createLocalStorage("AsyncAskConfirm", true);

describe("components/AsyncRender/AskConfirm:", () => {
  const pushConfirm = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    askStorage.set(true);
    pushConfirm.mockResolvedValue(true);
    mockUsePushConfirm.mockReturnValue(pushConfirm);
  });

  const showConfirm = () => {
    let confirm!: Promise<boolean>;

    const tree = renderHook(usePushAskConfirm, {
      inner({ current }) {
        const [footer, setFooter] = useState();
        useEffect(() => {
          confirm = current({
            shouldAsk: askStorage,
            title: "AsyncAskConfirm",
            cancel: "Cancel",
            accept: "Accept",
          });

          setFooter(pushConfirm.mock.lastCall?.[0].footer);
        }, []);
        return <>{footer}</>;
      },
    });

    return { ...tree, confirm };
  };

  it("should show confirm & accept", () => {
    const { confirm } = showConfirm();

    expect(pushConfirm).toBeCalled();

    expect(confirm).resolves.toBe(true);
  });

  it("should show confirm & cancel", () => {
    pushConfirm.mockResolvedValue(false);
    const { confirm } = showConfirm();

    expect(pushConfirm).toBeCalled();
    expect(confirm).resolves.toBe(false);
  });

  it("should toggle ask me", () => {
    const { getByRole } = showConfirm();

    fireEvent.click(getByRole("checkbox"));
    expect(askStorage.get()).toBe(false);

    fireEvent.click(getByRole("checkbox"));
    expect(askStorage.get()).toBe(true);
  });

  it("should restore ask when cancel", async () => {
    const completer = new Completer<boolean>();
    pushConfirm.mockReturnValue(completer);

    const { getByRole, confirm } = showConfirm();

    fireEvent.click(getByRole("checkbox"));
    expect(askStorage.get()).toBe(false);

    completer.resolve(false);

    await completer;

    expect(askStorage.get()).toBe(true);
    expect(confirm).resolves.toBe(false);
  });

  it("should don't confirm", () => {
    askStorage.set(false);
    const { confirm } = showConfirm();
    expect(confirm).resolves.toBe(true);
  });
});
