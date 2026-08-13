import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AddSkillModal } from "@/components/skills/add-skill-modal";
import { listarCatalogoSkills } from "@/services/skills-api";

vi.mock("@/services/skills-api", () => ({
    listarCatalogoSkills: vi.fn(),
}));

const CATALOG = [
    { id: 1, nome: "React", descricao: "Biblioteca de UI" },
    { id: 2, nome: "Node.js", descricao: "Runtime JavaScript" },
];

describe("AddSkillModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(listarCatalogoSkills).mockResolvedValue(CATALOG);
    });

    it("loads the skill catalog and lets the user pick a skill and level", async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);
        const onClose = vi.fn();
        const user = userEvent.setup();

        render(<AddSkillModal onClose={onClose} onSave={onSave} />);

        expect(listarCatalogoSkills).toHaveBeenCalled();

        await user.click(
            await screen.findByRole("combobox", { name: "Skill" }),
        );
        await user.click(
            await screen.findByRole("option", { name: "React" }),
        );

        expect(
            await screen.findByText("Biblioteca de UI"),
        ).toBeInTheDocument();

        const levelInput = screen.getByLabelText("Level") as HTMLInputElement;
        await user.clear(levelInput);
        await user.type(levelInput, "3");

        await user.click(screen.getByRole("button", { name: /salvar/i }));

        await waitFor(() =>
            expect(onSave).toHaveBeenCalledWith({ skillId: 1, level: 3 }),
        );
    });

    it("shows a validation error when submitting without a selected skill", async () => {
        const onSave = vi.fn();
        const user = userEvent.setup();

        render(<AddSkillModal onClose={vi.fn()} onSave={onSave} />);

        await screen.findByText("React");
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(
            await screen.findByText("Selecione uma skill."),
        ).toBeInTheDocument();
        expect(onSave).not.toHaveBeenCalled();
    });

    it("shows an inline error when onSave rejects", async () => {
        const onSave = vi.fn().mockRejectedValue(new Error("Falha ao salvar."));
        const user = userEvent.setup();

        render(<AddSkillModal onClose={vi.fn()} onSave={onSave} />);

        await user.click(
            await screen.findByRole("combobox", { name: "Skill" }),
        );
        await user.click(
            await screen.findByRole("option", { name: "React" }),
        );
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(
            await screen.findByText("Falha ao salvar."),
        ).toBeInTheDocument();
    });

    it("closes the modal when clicking the backdrop or cancel button", async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();

        render(<AddSkillModal onClose={onClose} onSave={vi.fn()} />);

        await user.click(screen.getByRole("button", { name: /cancelar/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes the modal when pressing Escape", async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();

        render(<AddSkillModal onClose={onClose} onSave={vi.fn()} />);

        await user.keyboard("{Escape}");
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
