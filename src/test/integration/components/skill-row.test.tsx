import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SkillRow } from "@/components/skills/skill-row";
import { AUTH_STORAGE_KEY, AuthProvider } from "@/contexts/authContext";
import type { UserSkill } from "@/services/skills-api";

const SKILL: UserSkill = {
    id: 1,
    skillId: 10,
    nome: "React",
    descricao: "Biblioteca de UI para construir interfaces",
    level: 3,
};

function renderAsRole(role: "ADMIN" | "USER", props: Partial<React.ComponentProps<typeof SkillRow>> = {}) {
    localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ usuarioId: 1, usuario: "joao", token: "t", role }),
    );

    const defaultProps: React.ComponentProps<typeof SkillRow> = {
        skill: SKILL,
        confirming: false,
        onIncLevel: vi.fn(),
        onDecLevel: vi.fn(),
        onEdit: vi.fn(),
        onAskDelete: vi.fn(),
        onCancelDelete: vi.fn(),
        onConfirmDelete: vi.fn(),
        ...props,
    };

    return {
        ...render(
            <AuthProvider>
                <SkillRow {...defaultProps} />
            </AuthProvider>,
        ),
        props: defaultProps,
    };
}

describe("SkillRow", () => {
    it("renders the skill name, description, and level", async () => {
        renderAsRole("USER");

        expect(await screen.findByText("React")).toBeInTheDocument();
        expect(
            screen.getByText("Biblioteca de UI para construir interfaces"),
        ).toBeInTheDocument();
        expect(screen.getByText("Lvl 3")).toBeInTheDocument();
    });

    it("renders an initials avatar when there is no imgUrl", async () => {
        renderAsRole("USER");

        expect(await screen.findByText("RE")).toBeInTheDocument();
    });

    it("renders an image avatar when imgUrl is present", async () => {
        renderAsRole("USER", {
            skill: { ...SKILL, imgUrl: "https://example.com/react.png" },
        });

        const img = await screen.findByAltText("React");
        expect(img).toHaveAttribute("src", "https://example.com/react.png");
    });

    it("calls onIncLevel / onDecLevel when the level buttons are clicked", async () => {
        const user = userEvent.setup();
        const { props } = renderAsRole("USER");
        await screen.findByText("React");

        await user.click(screen.getByLabelText("Aumentar level"));
        await user.click(screen.getByLabelText("Diminuir level"));

        expect(props.onIncLevel).toHaveBeenCalledTimes(1);
        expect(props.onDecLevel).toHaveBeenCalledTimes(1);
    });

    it("shows the edit button only for ADMIN users", async () => {
        renderAsRole("ADMIN");
        expect(
            await screen.findByLabelText("Editar skill"),
        ).toBeInTheDocument();
    });

    it("hides the edit button for non-admin users", async () => {
        renderAsRole("USER");
        await screen.findByText("React");
        expect(screen.queryByLabelText("Editar skill")).not.toBeInTheDocument();
    });

    it("asks for delete confirmation and can confirm/cancel", async () => {
        const user = userEvent.setup();
        const { props } = renderAsRole("USER");
        await screen.findByText("React");

        await user.click(screen.getByLabelText("Excluir skill"));
        expect(props.onAskDelete).toHaveBeenCalledTimes(1);
    });

    it("shows Sim/Não when confirming delete and wires the callbacks", async () => {
        const user = userEvent.setup();
        const { props } = renderAsRole("USER", { confirming: true });
        await screen.findByText("Excluir?");

        await user.click(screen.getByText("Sim"));
        expect(props.onConfirmDelete).toHaveBeenCalledTimes(1);

        await user.click(screen.getByText("Não"));
        expect(props.onCancelDelete).toHaveBeenCalledTimes(1);
    });
});
