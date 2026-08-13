/// <reference types="cypress" />

const API_BASE_URL = "http://localhost:8080";

export type MockRole = "ADMIN" | "USER";

Cypress.Commands.add(
    "loginViaUi",
    (usuario: string, senha: string, role: MockRole = "USER") => {
        cy.intercept("POST", `${API_BASE_URL}/api/auth/login`, {
            statusCode: 200,
            body: {
                token: "fake-jwt-token",
                tipo: "Bearer",
                expiraEm: 3600,
                usuarioId: 1,
                login: usuario,
                role,
            },
        }).as("login");

        cy.visit("/login");
        cy.get("#usuario").type(usuario);
        cy.get("#senha").type(senha);
        cy.contains("button", "Fazer login").click();
        cy.wait("@login");
    },
);

declare global {
    namespace Cypress {
        interface Chainable {
            loginViaUi(
                usuario: string,
                senha: string,
                role?: MockRole,
            ): Chainable<void>;
        }
    }
}

export {};
