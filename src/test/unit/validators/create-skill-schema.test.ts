import { describe, expect, it } from "vitest";

import { CreateSkillSchema } from "@/validators/create-skill-schema";

describe("CreateSkillSchema", () => {
    it("accepts a valid payload with a URL image", () => {
        const result = CreateSkillSchema.safeParse({
            imgUrl: "https://example.com/image.png",
            nome: "React",
            descricao: "Biblioteca para UI",
            level: 3,
        });

        expect(result.success).toBe(true);
    });

    it("accepts an empty imgUrl (optional-or-empty-string)", () => {
        const result = CreateSkillSchema.safeParse({
            imgUrl: "",
            nome: "React",
            descricao: "Biblioteca para UI",
            level: 3,
        });

        expect(result.success).toBe(true);
    });

    it("accepts a payload without imgUrl at all", () => {
        const result = CreateSkillSchema.safeParse({
            nome: "React",
            descricao: "Biblioteca para UI",
            level: 3,
        });

        expect(result.success).toBe(true);
    });

    it("rejects an invalid imgUrl", () => {
        const result = CreateSkillSchema.safeParse({
            imgUrl: "not-a-url",
            nome: "React",
            descricao: "Biblioteca para UI",
            level: 3,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Informe uma URL válida.",
            );
        }
    });

    it("rejects an empty nome", () => {
        const result = CreateSkillSchema.safeParse({
            nome: "",
            descricao: "Biblioteca para UI",
            level: 3,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Informe o nome da skill.",
            );
        }
    });

    it("rejects an empty descricao", () => {
        const result = CreateSkillSchema.safeParse({
            nome: "React",
            descricao: "",
            level: 3,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Informe a descrição.",
            );
        }
    });

    it.each([0, 6])("rejects level %d outside the 1-5 range", (level) => {
        const result = CreateSkillSchema.safeParse({
            nome: "React",
            descricao: "Biblioteca para UI",
            level,
        });

        expect(result.success).toBe(false);
    });

    it.each([1, 5])("accepts boundary level %d", (level) => {
        const result = CreateSkillSchema.safeParse({
            nome: "React",
            descricao: "Biblioteca para UI",
            level,
        });

        expect(result.success).toBe(true);
    });
});
