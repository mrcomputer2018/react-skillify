import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
    it("joins multiple class names", () => {
        expect(cn("a", "b", "c")).toBe("a b c");
    });

    it("drops falsy values", () => {
        expect(cn("a", false, undefined, null, "", "b")).toBe("a b");
    });

    it("resolves conflicting tailwind classes, keeping the last one", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("merges conditional class objects", () => {
        expect(cn("base", { active: true, disabled: false })).toBe(
            "base active",
        );
    });
});
