import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, useTheme } from "@/contexts/theme-provider";

function ReadOutsideProvider() {
    const { theme } = useTheme();
    return <span data-testid="fallback-theme">{theme}</span>;
}

function Harness() {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme("light")}>light</button>
            <button onClick={() => setTheme("dark")}>dark</button>
            <button onClick={() => setTheme("system")}>system</button>
        </div>
    );
}

afterEach(() => {
    document.documentElement.classList.remove("light", "dark");
});

describe("ThemeProvider / useTheme", () => {
    it("applies the default theme to the document root", () => {
        render(
            <ThemeProvider defaultTheme="dark" storageKey="test-theme">
                <Harness />
            </ThemeProvider>,
        );

        expect(document.documentElement.classList.contains("dark")).toBe(
            true,
        );
        expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    it("reads a previously stored theme instead of the default", () => {
        localStorage.setItem("test-theme", "light");

        render(
            <ThemeProvider defaultTheme="dark" storageKey="test-theme">
                <Harness />
            </ThemeProvider>,
        );

        expect(screen.getByTestId("theme")).toHaveTextContent("light");
        expect(document.documentElement.classList.contains("light")).toBe(
            true,
        );
    });

    it("setTheme swaps the root class and persists to storage", async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider defaultTheme="dark" storageKey="test-theme">
                <Harness />
            </ThemeProvider>,
        );

        await user.click(screen.getByText("light"));

        expect(document.documentElement.classList.contains("light")).toBe(
            true,
        );
        expect(document.documentElement.classList.contains("dark")).toBe(
            false,
        );
        expect(localStorage.getItem("test-theme")).toBe("light");
    });

    it('resolves "system" theme using matchMedia', async () => {
        vi.spyOn(window, "matchMedia").mockImplementation(
            (query: string) =>
                ({
                    matches: query.includes("dark"),
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                }) as unknown as MediaQueryList,
        );
        const user = userEvent.setup();

        render(
            <ThemeProvider defaultTheme="light" storageKey="test-theme">
                <Harness />
            </ThemeProvider>,
        );

        await user.click(screen.getByText("system"));

        expect(document.documentElement.classList.contains("dark")).toBe(
            true,
        );
    });

    it("falls back to the context default ('system') outside of a ThemeProvider", () => {
        render(<ReadOutsideProvider />);

        expect(screen.getByTestId("fallback-theme")).toHaveTextContent(
            "system",
        );
    });
});
