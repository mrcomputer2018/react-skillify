import { describe, expect, it, vi } from "vitest";

import { clearData, getData, removeData, storeData } from "@/services/storage";

describe("storage service", () => {
    it("stores and retrieves a JSON-serializable value", async () => {
        await storeData("theme", "dark");

        expect(await getData("theme")).toBe("dark");
    });

    it("stores and retrieves an object", async () => {
        const user = { id: 1, name: "joao" };
        await storeData("user", user);

        expect(await getData("user")).toEqual(user);
    });

    it("returns null for a missing key", async () => {
        expect(await getData("missing-key")).toBeNull();
    });

    it("removes a stored value", async () => {
        await storeData("temp", "value");
        await removeData("temp");

        expect(await getData("temp")).toBeNull();
    });

    it("clears all stored values", async () => {
        await storeData("a", 1);
        await storeData("b", 2);

        await clearData();

        expect(await getData("a")).toBeNull();
        expect(await getData("b")).toBeNull();
    });

    it("logs and swallows errors when reading corrupted JSON", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        localStorage.setItem("corrupted", "{not-json");

        const result = await getData("corrupted");

        expect(result).toBeUndefined();
        expect(errorSpy).toHaveBeenCalled();
    });
});
