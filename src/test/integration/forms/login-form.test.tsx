import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import { LoginForm } from "@/components/form/login-form";
import { AUTH_STORAGE_KEY, AuthProvider } from "@/contexts/authContext";
import { login as loginRequest } from "@/services/skills-api";

const navigateMock = vi.fn();

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/services/skills-api", () => ({
    login: vi.fn(),
}));

const SAVED_CREDENTIALS_KEY = "skills_saved_credentials";

function renderLoginForm() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        </MemoryRouter>,
    );
}

describe("LoginForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("keeps the submit button disabled until both fields are filled", async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const submit = screen.getByRole("button", { name: /fazer login/i });
        expect(submit).toBeDisabled();

        await user.type(
            screen.getByPlaceholderText("Digite seu nome de usuário"),
            "joao",
        );
        expect(submit).toBeDisabled();

        await user.type(
            screen.getByPlaceholderText("Digite sua senha"),
            "1234",
        );
        expect(submit).toBeEnabled();
    });

    it("shows a validation error when the senha is too short on blur", async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const senhaInput = screen.getByPlaceholderText("Digite sua senha");
        await user.type(senhaInput, "12");
        await user.tab();

        expect(
            await screen.findByText(
                "A senha deve ter no mínimo 4 caracteres.",
            ),
        ).toBeInTheDocument();
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const senhaInput = screen.getByPlaceholderText(
            "Digite sua senha",
        ) as HTMLInputElement;
        expect(senhaInput.type).toBe("password");

        await user.click(screen.getByLabelText("Mostrar senha"));
        expect(senhaInput.type).toBe("text");

        await user.click(screen.getByLabelText("Ocultar senha"));
        expect(senhaInput.type).toBe("password");
    });

    it("logs in successfully, persists the session, and navigates to /home", async () => {
        vi.mocked(loginRequest).mockResolvedValue({
            usuarioId: 1,
            usuario: "joao",
            token: "tok-1",
            role: "USER",
        });
        const user = userEvent.setup();
        renderLoginForm();

        await user.type(
            screen.getByPlaceholderText("Digite seu nome de usuário"),
            "joao",
        );
        await user.type(
            screen.getByPlaceholderText("Digite sua senha"),
            "1234",
        );
        await user.click(screen.getByRole("button", { name: /fazer login/i }));

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/home"));
        expect(loginRequest).toHaveBeenCalledWith("joao", "1234");
        expect(
            JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null"),
        ).toEqual({
            usuarioId: 1,
            usuario: "joao",
            token: "tok-1",
            role: "USER",
        });
    });

    it("shows an error message when login fails", async () => {
        vi.mocked(loginRequest).mockRejectedValue(
            new Error("Usuário ou senha inválidos."),
        );
        const user = userEvent.setup();
        renderLoginForm();

        await user.type(
            screen.getByPlaceholderText("Digite seu nome de usuário"),
            "joao",
        );
        await user.type(
            screen.getByPlaceholderText("Digite sua senha"),
            "1234",
        );
        await user.click(screen.getByRole("button", { name: /fazer login/i }));

        expect(
            await screen.findByText("Usuário ou senha inválidos."),
        ).toBeInTheDocument();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it("warns before saving the password and stores credentials once confirmed", async () => {
        vi.mocked(loginRequest).mockResolvedValue({
            usuarioId: 1,
            usuario: "joao",
            token: "tok-1",
            role: "USER",
        });
        const user = userEvent.setup();
        renderLoginForm();

        await user.type(
            screen.getByPlaceholderText("Digite seu nome de usuário"),
            "joao",
        );
        await user.type(
            screen.getByPlaceholderText("Digite sua senha"),
            "1234",
        );

        await user.click(screen.getByText("Gravar senha"));
        expect(
            screen.getByText("Gravar senha neste dispositivo?"),
        ).toBeInTheDocument();

        await user.click(screen.getByText("Entendi, gravar"));
        expect(
            screen.queryByText("Gravar senha neste dispositivo?"),
        ).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /fazer login/i }));

        await waitFor(() =>
            expect(
                JSON.parse(
                    localStorage.getItem(SAVED_CREDENTIALS_KEY) ?? "null",
                ),
            ).toEqual({ usuario: "joao", senha: "1234" }),
        );
    });

    it("clears the username and password when unchecking gravar senha", async () => {
        const user = userEvent.setup();
        renderLoginForm();

        await user.type(
            screen.getByPlaceholderText("Digite seu nome de usuário"),
            "joao",
        );
        await user.type(
            screen.getByPlaceholderText("Digite sua senha"),
            "1234",
        );
        await user.click(screen.getByText("Gravar senha"));
        await user.click(screen.getByText("Entendi, gravar"));

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeChecked();

        await user.click(checkbox);

        expect(checkbox).not.toBeChecked();
        expect(
            (screen.getByPlaceholderText(
                "Digite seu nome de usuário",
            ) as HTMLInputElement).value,
        ).toBe("");
        expect(
            (screen.getByPlaceholderText(
                "Digite sua senha",
            ) as HTMLInputElement).value,
        ).toBe("");
    });

    it("pre-fills the form with previously saved credentials", async () => {
        localStorage.setItem(
            SAVED_CREDENTIALS_KEY,
            JSON.stringify({ usuario: "maria", senha: "abcd" }),
        );

        renderLoginForm();

        await waitFor(() =>
            expect(
                screen.getByPlaceholderText("Digite seu nome de usuário"),
            ).toHaveValue("maria"),
        );
        expect(screen.getByPlaceholderText("Digite sua senha")).toHaveValue(
            "abcd",
        );
        expect(screen.getByRole("checkbox")).toBeChecked();
    });
});
