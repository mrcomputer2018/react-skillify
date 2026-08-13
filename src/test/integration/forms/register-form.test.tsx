import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import { RegisterForm } from "@/components/form/register-form";
import { Toast } from "@/components/ui/toast";
import { ToastProvider } from "@/contexts/toastContext";
import { cadastrar } from "@/services/skills-api";

const navigateMock = vi.fn();

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/services/skills-api", () => ({
    cadastrar: vi.fn(),
}));

function renderRegisterForm() {
    return render(
        <MemoryRouter>
            <ToastProvider>
                <RegisterForm />
                <Toast />
            </ToastProvider>
        </MemoryRouter>,
    );
}

async function fillValidForm(
    user: ReturnType<typeof userEvent.setup>,
) {
    await user.type(
        screen.getByPlaceholderText("Escolha um nome de usuário"),
        "joaosilva",
    );
    await user.type(screen.getByPlaceholderText("Crie uma senha"), "senha123");
    await user.type(
        screen.getByPlaceholderText("Repita a senha"),
        "senha123",
    );
}

describe("RegisterForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a validation error for a short usuario on blur", async () => {
        const user = userEvent.setup();
        renderRegisterForm();

        await user.type(
            screen.getByPlaceholderText("Escolha um nome de usuário"),
            "abc",
        );
        await user.tab();

        expect(
            await screen.findByText(
                "O usuário deve ter no mínimo 4 caracteres.",
            ),
        ).toBeInTheDocument();
    });

    it("shows a validation error when passwords do not match", async () => {
        const user = userEvent.setup();
        renderRegisterForm();

        await user.type(
            screen.getByPlaceholderText("Escolha um nome de usuário"),
            "joaosilva",
        );
        await user.type(
            screen.getByPlaceholderText("Crie uma senha"),
            "senha123",
        );
        await user.type(
            screen.getByPlaceholderText("Repita a senha"),
            "outrasenha",
        );
        await user.tab();

        expect(
            await screen.findByText("As senhas não coincidem."),
        ).toBeInTheDocument();
    });

    it("toggles visibility independently for senha and confirmarSenha", async () => {
        const user = userEvent.setup();
        renderRegisterForm();

        const senha = screen.getByPlaceholderText(
            "Crie uma senha",
        ) as HTMLInputElement;
        const confirmar = screen.getByPlaceholderText(
            "Repita a senha",
        ) as HTMLInputElement;

        await user.click(
            screen.getAllByLabelText("Mostrar senha")[0],
        );
        expect(senha.type).toBe("text");
        expect(confirmar.type).toBe("password");
    });

    it("registers successfully, shows a success toast, and navigates to /login", async () => {
        vi.mocked(cadastrar).mockResolvedValue({ usuario: "joaosilva" });
        const user = userEvent.setup();
        renderRegisterForm();

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        await waitFor(() =>
            expect(navigateMock).toHaveBeenCalledWith("/login"),
        );
        expect(cadastrar).toHaveBeenCalledWith("joaosilva", "senha123");
        expect(
            await screen.findByText("Cadastro realizado com sucesso!"),
        ).toBeInTheDocument();
    });

    it("shows an inline error and does not navigate when registration fails", async () => {
        vi.mocked(cadastrar).mockRejectedValue(
            new Error("Usuário já cadastrado."),
        );
        const user = userEvent.setup();
        renderRegisterForm();

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(
            await screen.findByText("Usuário já cadastrado."),
        ).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });
});
