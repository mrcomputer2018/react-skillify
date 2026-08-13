import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Toast } from "@/components/ui/toast";
import { ToastProvider, useToast } from "@/contexts/toastContext";

function Trigger() {
    const { showToast } = useToast();
    return (
        <div>
            <button onClick={() => showToast("success", "Skill adicionada!")}>
                success
            </button>
            <button onClick={() => showToast("error", "Erro ao salvar.")}>
                error
            </button>
        </div>
    );
}

describe("Toast", () => {
    it("renders nothing when there is no active toast", () => {
        render(
            <ToastProvider>
                <Toast />
            </ToastProvider>,
        );

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("renders a success toast with the status role", async () => {
        const user = userEvent.setup();
        render(
            <ToastProvider>
                <Trigger />
                <Toast />
            </ToastProvider>,
        );

        await user.click(screen.getByText("success"));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("Skill adicionada!");
    });

    it("renders an error toast with the status role", async () => {
        const user = userEvent.setup();
        render(
            <ToastProvider>
                <Trigger />
                <Toast />
            </ToastProvider>,
        );

        await user.click(screen.getByText("error"));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("Erro ao salvar.");
    });
});
