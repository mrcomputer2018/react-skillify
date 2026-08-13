import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/services/api";
import {
    adicionarSkill,
    atualizarLevelSkill,
    atualizarSkill,
    cadastrar,
    criarSkill,
    deletarSkill,
    listarCatalogoSkills,
    listarSkillsDoUsuario,
    login,
} from "@/services/skills-api";

vi.mock("@/services/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

const mockedApi = vi.mocked(api, true);

describe("skills-api service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("login() maps the DTO into the app's user shape", async () => {
        mockedApi.post.mockResolvedValue({
            data: {
                token: "tok",
                tipo: "Bearer",
                expiraEm: 3600,
                usuarioId: 9,
                login: "joao",
                role: "ADMIN",
            },
        });

        const result = await login("joao", "senha123");

        expect(mockedApi.post).toHaveBeenCalledWith("/api/auth/login", {
            login: "joao",
            senha: "senha123",
        });
        expect(result).toEqual({
            usuarioId: 9,
            usuario: "joao",
            token: "tok",
            role: "ADMIN",
        });
    });

    it("cadastrar() maps the DTO into { usuario }", async () => {
        mockedApi.post.mockResolvedValue({
            data: { id: 1, login: "joao", mensagem: "ok" },
        });

        const result = await cadastrar("joao", "senha123");

        expect(mockedApi.post).toHaveBeenCalledWith("/api/auth/cadastro", {
            login: "joao",
            senha: "senha123",
        });
        expect(result).toEqual({ usuario: "joao" });
    });

    it("listarCatalogoSkills() maps urlImagem to imgUrl", async () => {
        mockedApi.get.mockResolvedValue({
            data: [
                { id: 1, nome: "React", descricao: "UI", urlImagem: "img.png" },
                { id: 2, nome: "Node", descricao: "BE", urlImagem: "" },
            ],
        });

        const result = await listarCatalogoSkills();

        expect(mockedApi.get).toHaveBeenCalledWith("/api/skills");
        expect(result).toEqual([
            { id: 1, nome: "React", descricao: "UI", imgUrl: "img.png" },
            { id: 2, nome: "Node", descricao: "BE", imgUrl: undefined },
        ]);
    });

    it("criarSkill() posts the payload and maps the response", async () => {
        mockedApi.post.mockResolvedValue({
            data: { id: 5, nome: "Go", descricao: "Backend", urlImagem: "go.png" },
        });

        const result = await criarSkill("Go", "Backend", "go.png");

        expect(mockedApi.post).toHaveBeenCalledWith("/api/skills", {
            nome: "Go",
            descricao: "Backend",
            urlImagem: "go.png",
        });
        expect(result).toEqual({
            id: 5,
            nome: "Go",
            descricao: "Backend",
            imgUrl: "go.png",
        });
    });

    it("criarSkill() sends undefined urlImagem when imgUrl is omitted", async () => {
        mockedApi.post.mockResolvedValue({
            data: { id: 5, nome: "Go", descricao: "Backend" },
        });

        await criarSkill("Go", "Backend");

        expect(mockedApi.post).toHaveBeenCalledWith("/api/skills", {
            nome: "Go",
            descricao: "Backend",
            urlImagem: undefined,
        });
    });

    it("atualizarSkill() puts to the skill id endpoint", async () => {
        mockedApi.put.mockResolvedValue({
            data: { id: 5, nome: "Go", descricao: "Backend v2" },
        });

        const result = await atualizarSkill(5, "Go", "Backend v2");

        expect(mockedApi.put).toHaveBeenCalledWith("/api/skills/5", {
            nome: "Go",
            descricao: "Backend v2",
            urlImagem: undefined,
        });
        expect(result.descricao).toBe("Backend v2");
    });

    it("listarSkillsDoUsuario() maps nested DTO fields", async () => {
        mockedApi.get.mockResolvedValue({
            data: [
                {
                    id: 10,
                    skillId: 1,
                    nomeSkill: "React",
                    descricaoSkill: "UI",
                    urlImagemSkill: "img.png",
                    level: 3,
                },
            ],
        });

        const result = await listarSkillsDoUsuario();

        expect(mockedApi.get).toHaveBeenCalledWith("/api/usuario-skills");
        expect(result).toEqual([
            {
                id: 10,
                skillId: 1,
                nome: "React",
                descricao: "UI",
                imgUrl: "img.png",
                level: 3,
            },
        ]);
    });

    it("adicionarSkill() posts skillId and level", async () => {
        mockedApi.post.mockResolvedValue({
            data: {
                id: 11,
                skillId: 2,
                nomeSkill: "Node",
                descricaoSkill: "BE",
                level: 1,
            },
        });

        const result = await adicionarSkill(2, 1);

        expect(mockedApi.post).toHaveBeenCalledWith("/api/usuario-skills", {
            skillId: 2,
            level: 1,
        });
        expect(result.skillId).toBe(2);
    });

    it("atualizarLevelSkill() puts to the usuario-skills endpoint", async () => {
        mockedApi.put.mockResolvedValue({
            data: {
                id: 11,
                skillId: 2,
                nomeSkill: "Node",
                descricaoSkill: "BE",
                level: 4,
            },
        });

        const result = await atualizarLevelSkill(2, 4);

        expect(mockedApi.put).toHaveBeenCalledWith("/api/usuario-skills/2", {
            level: 4,
        });
        expect(result.level).toBe(4);
    });

    it("deletarSkill() calls delete on the skill id endpoint", async () => {
        mockedApi.delete.mockResolvedValue({ data: undefined });

        await deletarSkill(2);

        expect(mockedApi.delete).toHaveBeenCalledWith("/api/skills/2");
    });
});
