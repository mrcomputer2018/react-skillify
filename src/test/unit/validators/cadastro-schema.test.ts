import { describe, expect, it } from "vitest";

import { CadastroSchema } from "@/validators/cadastro-schema";

describe("CadastroSchema", () => {
    it("accepts a valid registration payload", () => {
        const result = CadastroSchema.safeParse({
            usuario: "joaosilva",
            senha: "senha123",
            confirmarSenha: "senha123",
        });

        expect(result.success).toBe(true);
    });

    it("rejects usuario shorter than 4 characters", () => {
        const result = CadastroSchema.safeParse({
            usuario: "abc",
            senha: "senha123",
            confirmarSenha: "senha123",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "O usuário deve ter no mínimo 4 caracteres.",
            );
        }
    });

    it("rejects usuario longer than 50 characters", () => {
        const result = CadastroSchema.safeParse({
            usuario: "a".repeat(51),
            senha: "senha123",
            confirmarSenha: "senha123",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "O usuário deve ter no máximo 50 caracteres.",
            );
        }
    });

    it("rejects senha shorter than 6 characters", () => {
        const result = CadastroSchema.safeParse({
            usuario: "joaosilva",
            senha: "123",
            confirmarSenha: "123",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "A senha deve ter no mínimo 6 caracteres.",
            );
        }
    });

    it("rejects when senha and confirmarSenha do not match", () => {
        const result = CadastroSchema.safeParse({
            usuario: "joaosilva",
            senha: "senha123",
            confirmarSenha: "outrasenha",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) =>
                i.path.includes("confirmarSenha"),
            );
            expect(issue?.message).toBe("As senhas não coincidem.");
        }
    });

    it("rejects an empty confirmarSenha", () => {
        const result = CadastroSchema.safeParse({
            usuario: "joaosilva",
            senha: "senha123",
            confirmarSenha: "",
        });

        expect(result.success).toBe(false);
    });
});
