import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EmptyState } from "@/components/skills/empty-state";

describe("EmptyState", () => {
    it("renders the empty state copy", () => {
        render(<EmptyState onAdd={vi.fn()} />);

        expect(
            screen.getByText("Nenhuma skill adicionada ainda"),
        ).toBeInTheDocument();
    });

    it("calls onAdd when the CTA button is clicked", async () => {
        const onAdd = vi.fn();
        const user = userEvent.setup();
        render(<EmptyState onAdd={onAdd} />);

        await user.click(
            screen.getByRole("button", { name: "Adicionar primeira skill" }),
        );

        expect(onAdd).toHaveBeenCalledTimes(1);
    });
});
