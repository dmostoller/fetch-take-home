/// <reference types="cypress" />

describe("Dog Search and Favorites Flow", () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept("POST", "/api/auth", {
      statusCode: 200,
      body: { success: true },
    }).as("auth");

    // Mock dog search
    cy.intercept("GET", "/api/dogs/search*", {
      statusCode: 200,
      body: {
        dogs: [
          {
            id: "1",
            name: "Max",
            breed: "Labrador",
            age: 3,
            img: "test.jpg",
            zip_code: "12345",
          },
        ],
        total: 1,
      },
    }).as("searchDogs");

    cy.visit("/");
  });

  it("completes the main user flow", () => {
    // Search for dogs
    cy.get('[data-testid="breed-select"]').click().type("Labrador{enter}");
    cy.get('[data-testid="search-button"]').click();
    cy.wait("@searchDogs");

    // Add to favorites
    cy.get('[data-testid="dog-card"]')
      .first()
      .within(() => {
        cy.get("button")
          .contains(/favorite/i)
          .click();
      });

    // Navigate to favorites
    cy.get('[data-testid="favorites-link"]').click();

    // Generate match
    cy.get("button")
      .contains(/Find Your Forever Friend/i)
      .click();

    // Verify match result
    cy.get('[data-testid="matched-dog"]').should("be.visible");
  });
});
