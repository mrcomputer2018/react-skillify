/// <reference types="cypress" />

const API_BASE_URL = "http://localhost:8080";

const REACT_SKILL = {
    id: 1,
    skillId: 10,
    nomeSkill: "React",
    descricaoSkill: "Biblioteca de UI",
    urlImagemSkill: "",
    level: 2,
};

describe("Gestão de skills", () => {
    beforeEach(() => {
        cy.clearLocalStorage();
    });

    it("mostra o estado vazio e adiciona a primeira skill", () => {
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [],
        }).as("usuarioSkills");
        cy.intercept("GET", `${API_BASE_URL}/api/skills`, {
            statusCode: 200,
            body: [
                { id: 10, nome: "React", descricao: "Biblioteca de UI" },
            ],
        }).as("catalogo");
        cy.intercept("POST", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 201,
            body: REACT_SKILL,
        }).as("adicionarSkill");

        cy.loginViaUi("joao", "1234", "USER");
        cy.wait("@usuarioSkills");
        cy.contains("Nenhuma skill adicionada ainda").should("be.visible");

        cy.contains("button", "Adicionar primeira skill").click();
        cy.wait("@catalogo");

        cy.get("#modal-skillId").click();
        cy.get('[role="option"]').contains("React").click();
        cy.get("#modal-level").clear().type("2");
        cy.contains('[role="dialog"] button', "Salvar").click();

        cy.wait("@adicionarSkill");
        cy.contains("Skill adicionada!").should("be.visible");
        cy.contains("React").should("be.visible");
        cy.contains("Lvl 2").should("be.visible");
    });

    it("aumenta e diminui o level de uma skill existente", () => {
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [REACT_SKILL],
        }).as("usuarioSkills");
        cy.intercept("PUT", `${API_BASE_URL}/api/usuario-skills/10`, {
            statusCode: 200,
            body: { ...REACT_SKILL, level: 3 },
        }).as("atualizarLevel");

        cy.loginViaUi("joao", "1234", "USER");
        cy.wait("@usuarioSkills");
        cy.contains("Lvl 2").should("be.visible");

        cy.get('[aria-label="Aumentar level"]').click();
        cy.wait("@atualizarLevel");
        cy.contains("Lvl 3").should("be.visible");
    });

    it("exclui uma skill após confirmação", () => {
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [REACT_SKILL],
        }).as("usuarioSkills");
        cy.intercept("DELETE", `${API_BASE_URL}/api/skills/10`, {
            statusCode: 204,
        }).as("deletarSkill");

        cy.loginViaUi("joao", "1234", "USER");
        cy.wait("@usuarioSkills");
        cy.contains("React").should("be.visible");

        cy.get('[aria-label="Excluir skill"]').click();
        cy.contains("button", "Sim").click();

        cy.wait("@deletarSkill");
        cy.contains("Skill removida.").should("be.visible");
        cy.contains("React").should("not.exist");
    });

    it("permite que um ADMIN crie uma nova skill", () => {
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [],
        }).as("usuarioSkills");
        cy.intercept("GET", `${API_BASE_URL}/api/skills`, {
            statusCode: 200,
            body: [],
        }).as("catalogo");
        cy.intercept("POST", `${API_BASE_URL}/api/skills`, {
            statusCode: 201,
            body: { id: 30, nome: "Go", descricao: "Backend" },
        }).as("criarSkill");
        cy.intercept("POST", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 201,
            body: {
                id: 3,
                skillId: 30,
                nomeSkill: "Go",
                descricaoSkill: "Backend",
                level: 1,
            },
        }).as("adicionarSkill");

        cy.loginViaUi("admin", "1234", "ADMIN");
        cy.wait("@usuarioSkills");

        cy.contains("button", "Criar Skill").click();
        cy.get("#create-skill-nome").type("Go");
        cy.get("#create-skill-descricao").type("Backend");
        cy.contains('[role="dialog"] button', "Salvar").click();

        cy.wait("@criarSkill");
        cy.wait("@adicionarSkill");
        cy.contains("Skill criada!").should("be.visible");
        cy.contains("Go").should("be.visible");
    });

    it("não mostra o botão Criar Skill para usuários comuns", () => {
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [],
        }).as("usuarioSkills");

        cy.loginViaUi("joao", "1234", "USER");
        cy.wait("@usuarioSkills");

        cy.contains("button", "Criar Skill").should("not.exist");
    });

    it("faz logout e volta para a tela de login", () => {
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [],
        }).as("usuarioSkills");

        cy.loginViaUi("joao", "1234", "USER");
        cy.wait("@usuarioSkills");

        cy.contains("button", "Sair").click();
        cy.location("pathname").should("eq", "/login");
    });
});
