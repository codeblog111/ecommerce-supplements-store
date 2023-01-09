/// <reference types="Cypress" />

describe('HomeScreen', () => {
  before(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');

    // Seed database
    cy.exec('npm run data-test:import');

    // Visit the site
    cy.visit('/');
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('show product carousel', () => {
    cy.get('[data-cy=carousel]').should('be.visible');
  });

  it('show authenticity banner', () => {
    cy.contains('Authenticity Information When Buying Your Supplements').should(
      'be.visible'
    );
  });

  it('show latest products', () => {
    cy.contains('LATEST PRODUCTS').should(
      'be.visible'
    );
    cy.get('[data-cy=latest-products]').should('have.length', 4);
  });

  it('show trending proteins', () => {
    cy.contains('TRENDING IN PROTEIN').should(
      'be.visible'
    );
    cy.get('[data-cy=trending-protein]').should('have.length', 4);
  });

  it('show trending bcaa', () => {
    cy.contains('TRENDING IN AMINOS/BCAA').should(
      'be.visible'
    );
    cy.get('[data-cy=trending-bcaa]').should('have.length', 4);
  });

  it('show all products', () => {
    cy.get('[data-cy=view-all]').click();
    cy.location('pathname').should('equal', '/products');
    cy.get('[data-cy=product-all]').should('be.visible');
    cy.get('[data-cy=back-btn]').should('be.visible');
    cy.get('[data-cy=back-btn]').click()
    cy.location('pathname').should('equal', '/');
  });
});
