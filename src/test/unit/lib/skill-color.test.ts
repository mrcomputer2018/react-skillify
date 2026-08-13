import { describe, expect, it } from "vitest";

import { getSkillColor } from "@/lib/skill-color";

const PALETTE = [
    "#4f7efe",
    "#4fbffe",
    "#7a6ef0",
    "#4fd1b3",
    "#f0a64f",
    "#f04f8b",
];

describe("getSkillColor", () => {
    it("returns a color from the palette for a numeric id", () => {
        expect(PALETTE).toContain(getSkillColor(1));
    });

    it("returns a color from the palette for a string id", () => {
        expect(PALETTE).toContain(getSkillColor("abc"));
    });

    it("is deterministic for the same id", () => {
        expect(getSkillColor(42)).toBe(getSkillColor(42));
        expect(getSkillColor("react")).toBe(getSkillColor("react"));
    });

    it("treats numeric and string forms of the same id the same way", () => {
        expect(getSkillColor(7)).toBe(getSkillColor("7"));
    });

    it("can produce different colors for different ids", () => {
        const colors = new Set(
            Array.from({ length: 20 }, (_, i) => getSkillColor(i)),
        );
        expect(colors.size).toBeGreaterThan(1);
    });
});
