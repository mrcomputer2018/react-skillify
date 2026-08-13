import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AUTH_STORAGE_KEY, type AuthUser } from "@/contexts/authContext";
import { api } from "@/services/api";

const AUTH_USER: AuthUser = {
    usuarioId: 1,
    usuario: "joao",
    token: "abc123",
    role: "USER",
};

describe("api service", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.restore();
    });

    it("attaches the Authorization header when a user is stored", async () => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(AUTH_USER));
        mock.onGet("/api/whoami").reply((config) => {
            expect(config.headers?.Authorization).toBe("Bearer abc123");
            return [200, { ok: true }];
        });

        const { data } = await api.get("/api/whoami");
        expect(data).toEqual({ ok: true });
    });

    it("does not attach an Authorization header when no user is stored", async () => {
        mock.onGet("/api/whoami").reply((config) => {
            expect(config.headers?.Authorization).toBeUndefined();
            return [200, { ok: true }];
        });

        await api.get("/api/whoami");
    });

    it("clears the stored user on a 401 response", async () => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(AUTH_USER));
        mock.onGet("/api/protected").reply(401, { mensagem: "Não autorizado" });

        await expect(api.get("/api/protected")).rejects.toThrow(
            "Não autorizado",
        );
        expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    });

    it("prefers the mensagem field from the error response body", async () => {
        mock.onPost("/api/auth/login").reply(400, {
            mensagem: "Usuário ou senha inválidos.",
        });

        await expect(
            api.post("/api/auth/login", { login: "x", senha: "y" }),
        ).rejects.toThrow("Usuário ou senha inválidos.");
    });

    it("falls back to a generic message when the response has no known field", async () => {
        mock.onGet("/api/skills").reply(500, {});

        await expect(api.get("/api/skills")).rejects.toThrow(
            "Erro ao comunicar com o servidor.",
        );
    });

    it("falls back to a generic message on a network error", async () => {
        mock.onGet("/api/skills").networkError();

        await expect(api.get("/api/skills")).rejects.toThrow(
            "Erro ao comunicar com o servidor.",
        );
    });
});
