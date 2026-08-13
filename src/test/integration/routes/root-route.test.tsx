import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import { RootRoute } from "@/routes";
import { AUTH_STORAGE_KEY, AuthProvider } from "@/contexts/authContext";
import { ToastProvider } from "@/contexts/toastContext";

vi.mock("@/services/skills-api", () => ({
    listarSkillsDoUsuario: vi.fn().mockResolvedValue([]),
    listarCatalogoSkills: vi.fn().mockResolvedValue([]),
}));

function renderAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
                <ToastProvider>
                    <RootRoute />
                </ToastProvider>
            </AuthProvider>
        </MemoryRouter>,
    );
}

describe("RootRoute", () => {
    it("renders the public routes (Login) when there is no authenticated user", async () => {
        renderAt("/login");

        expect(
            await screen.findByRole("button", { name: /fazer login/i }),
        ).toBeInTheDocument();
    });

    it("redirects an unknown public path to the Landing page", async () => {
        renderAt("/unknown-path");

        expect(
            await screen.findByRole("link", { name: "Entrar" }),
        ).toBeInTheDocument();
    });

    it("renders the private routes (Home) once a user is authenticated", async () => {
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                usuarioId: 1,
                usuario: "joao",
                token: "t",
                role: "USER",
            }),
        );

        renderAt("/login");

        await waitFor(() =>
            expect(screen.getByText("Minhas Skills")).toBeInTheDocument(),
        );
    });
});
