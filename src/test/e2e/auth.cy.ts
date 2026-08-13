/// <reference types="cypress" />

const API_BASE_URL = "http://localhost:8080";

describe("Autenticação", () => {
    beforeEach(() => {
        cy.clearLocalStorage();
    });

    it("faz login com sucesso e navega para /home", () => {
        cy.intercept("POST", `${API_BASE_URL}/api/auth/login`, {
            statusCode: 200,
            body: {
                token: "fake-jwt-token",
                tipo: "Bearer",
                expiraEm: 3600,
                usuarioId: 1,
                login: "joao",
                role: "USER",
            },
        }).as("login");
        cy.intercept("GET", `${API_BASE_URL}/api/usuario-skills`, {
            statusCode: 200,
            body: [],
        }).as("usuarioSkills");

        cy.visit("/login");
        cy.get("#usuario").type("joao");
        cy.get("#senha").type("1234");
        cy.contains("button", "Fazer login").click();

        cy.wait("@login");
        cy.location("pathname").should("eq", "/home");
        cy.contains("Minhas Skills").should("be.visible");
        cy.contains("Nenhuma skill adicionada ainda").should("be.visible");
    });

    it("mostra uma mensagem de erro quando o login falha", () => {
        cy.intercept("POST", `${API_BASE_URL}/api/auth/login`, {
            statusCode: 401,
            body: { mensagem: "Usuário ou senha inválidos." },
        }).as("login");

        cy.visit("/login");
        cy.get("#usuario").type("joao");
        cy.get("#senha").type("senhaerrada");
        cy.contains("button", "Fazer login").click();

        cy.wait("@login");
        cy.contains("Usuário ou senha inválidos.").should("be.visible");
        cy.location("pathname").should("eq", "/login");
    });

    it("valida os campos do formulário de login", () => {
        cy.visit("/login");

        cy.get("#senha").type("12").blur();
        cy.contains("A senha deve ter no mínimo 4 caracteres.").should(
            "be.visible",
        );
        cy.contains("button", "Fazer login").should("be.disabled");
    });

    it("navega entre login e cadastro", () => {
        cy.visit("/login");
        cy.contains("a", "Cadastre-se").click();
        cy.location("pathname").should("eq", "/register");

        cy.contains("a", "Voltar ao login").click();
        cy.location("pathname").should("eq", "/login");
    });

    it("cadastra um novo usuário e redireciona para /login", () => {
        cy.intercept("POST", `${API_BASE_URL}/api/auth/cadastro`, {
            statusCode: 200,
            body: { id: 1, login: "novousuario", mensagem: "Cadastrado." },
        }).as("cadastro");

        cy.visit("/register");
        cy.get("#usuario").type("novousuario");
        cy.get("#senha").type("senha123");
        cy.get("#confirmarSenha").type("senha123");
        cy.contains("button", "Salvar").click();

        cy.wait("@cadastro");
        cy.location("pathname").should("eq", "/login");
        cy.contains("Cadastro realizado com sucesso!").should("be.visible");
    });

    it("valida senhas divergentes no cadastro", () => {
        cy.visit("/register");
        cy.get("#usuario").type("novousuario");
        cy.get("#senha").type("senha123");
        cy.get("#confirmarSenha").type("outrasenha").blur();

        cy.contains("As senhas não coincidem.").should("be.visible");
    });

    it("redireciona para a Landing page ao acessar /home sem estar autenticado", () => {
        cy.visit("/home");
        cy.location("pathname").should("eq", "/");
        cy.contains("a", "Entrar").should("be.visible");
    });
});
