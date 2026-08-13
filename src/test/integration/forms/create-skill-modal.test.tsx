import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CreateSkillModal } from "@/components/skills/create-skill-modal";
import type { UserSkill } from "@/services/skills-api";

const EXISTING_SKILL: UserSkill = {
    id: 1,
    skillId: 10,
    nome: "React",
    descricao: "Biblioteca de UI",
    imgUrl: "https://example.com/react.png",
    level: 3,
};

describe("CreateSkillModal", () => {
    it("shows the 'Criar Skill' title with empty fields when there is no skill", () => {
        render(<CreateSkillModal onClose={vi.fn()} onSave={vi.fn()} />);

        expect(
            screen.getByRole("dialog", { name: "Criar Skill" }),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Digite o nome da skill"),
        ).toHaveValue("");
    });

    it("pre-fills the form and shows 'Editar Skill' when a skill is passed", () => {
        render(
            <CreateSkillModal
                skill={EXISTING_SKILL}
                onClose={vi.fn()}
                onSave={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("dialog", { name: "Editar Skill" }),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Digite o nome da skill"),
        ).toHaveValue("React");
        expect(screen.getByPlaceholderText("Descreva a skill")).toHaveValue(
            "Biblioteca de UI",
        );
        expect(screen.getByPlaceholderText("https://...")).toHaveValue(
            "https://example.com/react.png",
        );
        expect(screen.getByLabelText("Level")).toHaveValue(3);
    });

    it("validates required fields and an invalid image URL", async () => {
        const user = userEvent.setup();
        render(<CreateSkillModal onClose={vi.fn()} onSave={vi.fn()} />);

        await user.type(
            screen.getByPlaceholderText("https://..."),
            "not-a-url",
        );
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(
            await screen.findByText("Informe uma URL válida."),
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Informe o nome da skill."),
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Informe a descrição."),
        ).toBeInTheDocument();
    });

    it("submits a valid payload for a new skill", async () => {
        const onSave = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(<CreateSkillModal onClose={vi.fn()} onSave={onSave} />);

        await user.type(
            screen.getByPlaceholderText("Digite o nome da skill"),
            "Go",
        );
        await user.type(
            screen.getByPlaceholderText("Descreva a skill"),
            "Linguagem backend",
        );
        const levelInput = screen.getByLabelText("Level");
        await user.clear(levelInput);
        await user.type(levelInput, "4");

        await user.click(screen.getByRole("button", { name: /salvar/i }));

        await waitFor(() =>
            expect(onSave).toHaveBeenCalledWith({
                imgUrl: "",
                nome: "Go",
                descricao: "Linguagem backend",
                level: 4,
            }),
        );
    });

    it("shows an inline error when onSave rejects", async () => {
        const onSave = vi
            .fn()
            .mockRejectedValue(new Error("Erro ao salvar skill."));
        const user = userEvent.setup();
        render(
            <CreateSkillModal
                skill={EXISTING_SKILL}
                onClose={vi.fn()}
                onSave={onSave}
            />,
        );

        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(
            await screen.findByText("Erro ao salvar skill."),
        ).toBeInTheDocument();
    });

    it("closes the modal when pressing Escape", async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();
        render(<CreateSkillModal onClose={onClose} onSave={vi.fn()} />);

        await user.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
