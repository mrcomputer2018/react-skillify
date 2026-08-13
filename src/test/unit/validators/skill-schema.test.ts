import { describe, expect, it } from "vitest";

import { SkillSchema } from "@/validators/skill-schema";

describe("SkillSchema", () => {
    it("accepts a valid payload", () => {
        const result = SkillSchema.safeParse({ skillId: 4, level: 2 });

        expect(result.success).toBe(true);
    });

    it("rejects skillId equal to zero", () => {
        const result = SkillSchema.safeParse({ skillId: 0, level: 2 });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Selecione uma skill.",
            );
        }
    });

    it("rejects a negative skillId", () => {
        const result = SkillSchema.safeParse({ skillId: -1, level: 2 });

        expect(result.success).toBe(false);
    });

    it("rejects a non-integer skillId", () => {
        const result = SkillSchema.safeParse({ skillId: 1.5, level: 2 });

        expect(result.success).toBe(false);
    });

    it.each([0, 6])("rejects level %d outside the 1-5 range", (level) => {
        const result = SkillSchema.safeParse({ skillId: 1, level });

        expect(result.success).toBe(false);
    });

    it.each([1, 5])("accepts boundary level %d", (level) => {
        const result = SkillSchema.safeParse({ skillId: 1, level });

        expect(result.success).toBe(true);
    });
});
