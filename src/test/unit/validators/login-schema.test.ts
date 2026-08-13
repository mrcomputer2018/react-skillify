import { describe, expect, it } from "vitest";

import { LoginSchema } from "@/validators/login-schema";

describe("LoginSchema", () => {
    it("accepts a valid login payload", () => {
        const result = LoginSchema.safeParse({
            usuario: "joao",
            senha: "1234",
            gravarSenha: true,
        });

        expect(result.success).toBe(true);
    });

    it("accepts a payload without gravarSenha (optional)", () => {
        const result = LoginSchema.safeParse({
            usuario: "joao",
            senha: "1234",
        });

        expect(result.success).toBe(true);
    });

    it("rejects an empty usuario", () => {
        const result = LoginSchema.safeParse({ usuario: "", senha: "1234" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Informe seu nome de usuário.",
            );
        }
    });

    it("rejects a senha shorter than 4 characters", () => {
        const result = LoginSchema.safeParse({ usuario: "joao", senha: "123" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "A senha deve ter no mínimo 4 caracteres.",
            );
        }
    });

    it("rejects an empty senha with the required message", () => {
        const result = LoginSchema.safeParse({ usuario: "joao", senha: "" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "A senha é obrigatória.",
            );
        }
    });
});
