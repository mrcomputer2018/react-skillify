import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";

import { HomePage } from "@/pages/Home";
import { Toast } from "@/components/ui/toast";
import { AUTH_STORAGE_KEY, AuthProvider } from "@/contexts/authContext";
import { ToastProvider } from "@/contexts/toastContext";
import type { UserSkill, SkillOption } from "@/services/skills-api";

const navigateMock = vi.fn();

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/services/skills-api", () => ({
    listarSkillsDoUsuario: vi.fn(),
    listarCatalogoSkills: vi.fn(),
    adicionarSkill: vi.fn(),
    atualizarLevelSkill: vi.fn(),
    atualizarSkill: vi.fn(),
    criarSkill: vi.fn(),
    deletarSkill: vi.fn(),
}));

import {
    adicionarSkill,
    atualizarLevelSkill,
    atualizarSkill,
    criarSkill,
    deletarSkill,
    listarCatalogoSkills,
    listarSkillsDoUsuario,
} from "@/services/skills-api";

function seedUser(role: "ADMIN" | "USER") {
    localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ usuarioId: 1, usuario: "joao", token: "t", role }),
    );
}

function renderHome() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <ToastProvider>
                    <HomePage />
                    <Toast />
                </ToastProvider>
            </AuthProvider>
        </MemoryRouter>,
    );
}

const REACT_SKILL: UserSkill = {
    id: 1,
    skillId: 10,
    nome: "React",
    descricao: "Biblioteca de UI",
    level: 2,
};

const NODE_SKILL: UserSkill = {
    id: 2,
    skillId: 20,
    nome: "Node.js",
    descricao: "Runtime JS",
    level: 4,
};

describe("HomePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows the empty state when the user has no skills", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([]);

        renderHome();

        expect(
            await screen.findByText("Nenhuma skill adicionada ainda"),
        ).toBeInTheDocument();
        expect(listarCatalogoSkills).not.toHaveBeenCalled();
    });

    it("renders the user's skills once loaded", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([
            REACT_SKILL,
            NODE_SKILL,
        ]);

        renderHome();

        expect(await screen.findByText("React")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();
        expect(screen.getByText("Olá, joao")).toBeInTheDocument();
    });

    it("shows an error toast when loading skills fails", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockRejectedValue(
            new Error("Erro ao carregar skills."),
        );

        renderHome();

        expect(
            await screen.findByText("Erro ao carregar skills."),
        ).toBeInTheDocument();
    });

    it("auto-associates missing catalog skills for ADMIN users", async () => {
        seedUser("ADMIN");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([REACT_SKILL]);
        const catalog: SkillOption[] = [
            { id: 10, nome: "React", descricao: "Biblioteca de UI" },
            { id: 20, nome: "Node.js", descricao: "Runtime JS" },
        ];
        vi.mocked(listarCatalogoSkills).mockResolvedValue(catalog);
        vi.mocked(adicionarSkill).mockResolvedValue(NODE_SKILL);

        renderHome();

        expect(await screen.findByText("Node.js")).toBeInTheDocument();
        expect(adicionarSkill).toHaveBeenCalledWith(20, 1);
        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("increments and decrements a skill's level, clamped between 1 and 5", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([
            { ...REACT_SKILL, level: 1 },
        ]);
        vi.mocked(atualizarLevelSkill).mockResolvedValue({
            ...REACT_SKILL,
            level: 2,
        });
        const user = userEvent.setup();

        renderHome();
        await screen.findByText("React");

        expect(screen.getByText("Lvl 1")).toBeInTheDocument();

        await user.click(screen.getByLabelText("Diminuir level"));
        expect(atualizarLevelSkill).not.toHaveBeenCalled();
        expect(screen.getByText("Lvl 1")).toBeInTheDocument();

        await user.click(screen.getByLabelText("Aumentar level"));
        await waitFor(() =>
            expect(atualizarLevelSkill).toHaveBeenCalledWith(10, 2),
        );
        expect(screen.getByText("Lvl 2")).toBeInTheDocument();
    });

    it("adds a skill through the AddSkillModal", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([]);
        vi.mocked(listarCatalogoSkills).mockResolvedValue([
            { id: 10, nome: "React", descricao: "Biblioteca de UI" },
        ]);
        vi.mocked(adicionarSkill).mockResolvedValue(REACT_SKILL);
        const user = userEvent.setup();

        renderHome();
        await screen.findByText("Nenhuma skill adicionada ainda");

        await user.click(
            screen.getByRole("button", { name: "Adicionar Skill" }),
        );
        await user.click(
            await screen.findByRole("combobox", { name: "Skill" }),
        );
        await user.click(await screen.findByRole("option", { name: "React" }));
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(await screen.findByText("Skill adicionada!")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(adicionarSkill).toHaveBeenCalledWith(10, 1);
    });

    it("shows the 'Criar Skill' button only for ADMIN and creates a new skill", async () => {
        seedUser("ADMIN");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([]);
        vi.mocked(listarCatalogoSkills).mockResolvedValue([]);
        vi.mocked(criarSkill).mockResolvedValue({
            id: 30,
            nome: "Go",
            descricao: "Backend",
        });
        vi.mocked(adicionarSkill).mockResolvedValue({
            id: 3,
            skillId: 30,
            nome: "Go",
            descricao: "Backend",
            level: 2,
        });
        const user = userEvent.setup();

        renderHome();
        await screen.findByText("Nenhuma skill adicionada ainda");

        await user.click(screen.getByRole("button", { name: /criar skill/i }));
        await user.type(
            screen.getByPlaceholderText("Digite o nome da skill"),
            "Go",
        );
        await user.type(
            screen.getByPlaceholderText("Descreva a skill"),
            "Backend",
        );
        const levelInput = screen.getByLabelText("Level");
        await user.clear(levelInput);
        await user.type(levelInput, "2");
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(await screen.findByText("Skill criada!")).toBeInTheDocument();
        expect(criarSkill).toHaveBeenCalledWith("Go", "Backend", "");
        expect(adicionarSkill).toHaveBeenCalledWith(30, 2);
    });

    it("hides the 'Criar Skill' button for non-admin users", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([]);

        renderHome();
        await screen.findByText("Nenhuma skill adicionada ainda");

        expect(
            screen.queryByRole("button", { name: /criar skill/i }),
        ).not.toBeInTheDocument();
    });

    it("edits an existing skill as ADMIN", async () => {
        seedUser("ADMIN");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([REACT_SKILL]);
        vi.mocked(listarCatalogoSkills).mockResolvedValue([
            { id: 10, nome: "React", descricao: "Biblioteca de UI" },
        ]);
        vi.mocked(atualizarSkill).mockResolvedValue({
            id: 10,
            nome: "React",
            descricao: "Biblioteca de UI para SPAs",
        });
        vi.mocked(atualizarLevelSkill).mockResolvedValue({
            ...REACT_SKILL,
            descricao: "Biblioteca de UI para SPAs",
            level: 5,
        });
        const user = userEvent.setup();

        renderHome();
        await screen.findByText("React");

        await user.click(screen.getByLabelText("Editar skill"));
        expect(
            await screen.findByRole("dialog", { name: "Editar Skill" }),
        ).toBeInTheDocument();

        const descricaoInput = screen.getByPlaceholderText("Descreva a skill");
        await user.clear(descricaoInput);
        await user.type(descricaoInput, "Biblioteca de UI para SPAs");
        const levelInput = screen.getByLabelText("Level");
        await user.clear(levelInput);
        await user.type(levelInput, "5");
        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(
            await screen.findByText("Skill atualizada!"),
        ).toBeInTheDocument();
        expect(atualizarSkill).toHaveBeenCalledWith(
            10,
            "React",
            "Biblioteca de UI para SPAs",
            "",
        );
        expect(atualizarLevelSkill).toHaveBeenCalledWith(10, 5);
        expect(screen.getByText("Lvl 5")).toBeInTheDocument();
    });

    it("deletes a skill after confirmation", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([REACT_SKILL]);
        vi.mocked(deletarSkill).mockResolvedValue(undefined);
        const user = userEvent.setup();

        renderHome();
        const row = (await screen.findByText("React")).closest(
            "div.flex.flex-wrap",
        ) as HTMLElement;

        await user.click(within(row).getByLabelText("Excluir skill"));
        await user.click(within(row).getByText("Sim"));

        expect(deletarSkill).toHaveBeenCalledWith(10);
        expect(await screen.findByText("Skill removida.")).toBeInTheDocument();
        expect(screen.queryByText("React")).not.toBeInTheDocument();
    });

    it("cancels a delete request without calling the API", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([REACT_SKILL]);
        const user = userEvent.setup();

        renderHome();
        const row = (await screen.findByText("React")).closest(
            "div.flex.flex-wrap",
        ) as HTMLElement;

        await user.click(within(row).getByLabelText("Excluir skill"));
        await user.click(within(row).getByText("Não"));

        expect(deletarSkill).not.toHaveBeenCalled();
        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("logs out and navigates to /login", async () => {
        seedUser("USER");
        vi.mocked(listarSkillsDoUsuario).mockResolvedValue([]);
        const user = userEvent.setup();

        renderHome();
        await screen.findByText("Nenhuma skill adicionada ainda");

        await user.click(screen.getByText("Sair"));

        expect(navigateMock).toHaveBeenCalledWith("/login");
        await waitFor(() =>
            expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull(),
        );
    });
});
