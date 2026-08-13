import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast } from "@/contexts/toastContext";

function ThrowingComponent() {
    useToast();
    return null;
}

function Harness() {
    const { toast, showToast } = useToast();
    return (
        <div>
            <span data-testid="toast">
                {toast ? `${toast.type}:${toast.message}` : "none"}
            </span>
            <button onClick={() => showToast("success", "Skill adicionada!")}>
                success
            </button>
            <button onClick={() => showToast("error", "Falhou")}>error</button>
        </div>
    );
}

describe("ToastProvider / useToast", () => {
    it("starts with no toast", () => {
        render(
            <ToastProvider>
                <Harness />
            </ToastProvider>,
        );

        expect(screen.getByTestId("toast")).toHaveTextContent("none");
    });

    it("shows a toast after calling showToast", async () => {
        const user = userEvent.setup();
        render(
            <ToastProvider>
                <Harness />
            </ToastProvider>,
        );

        await user.click(screen.getByText("success"));

        expect(screen.getByTestId("toast")).toHaveTextContent(
            "success:Skill adicionada!",
        );
    });

    it("auto-dismisses the toast after 3 seconds", () => {
        vi.useFakeTimers();

        render(
            <ToastProvider>
                <Harness />
            </ToastProvider>,
        );

        fireEvent.click(screen.getByText("error"));
        expect(screen.getByTestId("toast")).toHaveTextContent("error:Falhou");

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(screen.getByTestId("toast")).toHaveTextContent("none");
    });

    it("restarts the dismiss timer when a new toast is shown before the old one clears", () => {
        vi.useFakeTimers();

        render(
            <ToastProvider>
                <Harness />
            </ToastProvider>,
        );

        fireEvent.click(screen.getByText("success"));
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        fireEvent.click(screen.getByText("error"));
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.getByTestId("toast")).toHaveTextContent("error:Falhou");

        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(screen.getByTestId("toast")).toHaveTextContent("none");
    });

    it("throws when useToast is used outside of a ToastProvider", () => {
        expect(() => render(<ThrowingComponent />)).toThrow(
            "useToast deve ser usado dentro de um ToastProvider.",
        );
    });
});
