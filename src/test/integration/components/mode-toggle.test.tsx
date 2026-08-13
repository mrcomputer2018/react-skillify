import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/contexts/theme-provider";

describe("ModeToggle", () => {
    it("opens a menu with Light/Dark/System options and applies the chosen theme", async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider defaultTheme="dark" storageKey="mode-toggle-test">
                <ModeToggle />
            </ThemeProvider>,
        );

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));

        const lightOption = await screen.findByText("Light");
        await user.click(lightOption);

        expect(document.documentElement.classList.contains("light")).toBe(
            true,
        );
        expect(localStorage.getItem("mode-toggle-test")).toBe("light");

        document.documentElement.classList.remove("light", "dark");
    });
});
