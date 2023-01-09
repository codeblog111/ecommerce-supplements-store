/// <reference types="Cypress" />

describe('CollectionScreen', () => {
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

  it('show protein collections', () => {
    cy.get('[data-cy=nav-btn-protein]').click();
    cy.location('pathname').should('equal', '/collections/protein');
    cy.get('[data-cy=product-collection-protein]').should('be.visible');
  });

  it('show bcaa collections', () => {
    cy.visit('/');
    cy.get('[data-cy=nav-btn-essentials]').click();
    cy.get('[data-cy=nav-btn-bcaa]').click();
    cy.location('pathname').should('equal', '/collections/bcaa');
    cy.get('[data-cy=product-collection-bcaa]').should('be.visible');
  });

  it('show glutamine collections', () => {
    cy.visit('/');
    cy.get('[data-cy=nav-btn-essentials]').click();
    cy.get('[data-cy=nav-btn-glutamine]').click();
    cy.location('pathname').should('equal', '/collections/glutamine');
    cy.get('[data-cy=product-collection-glutamine]').should('be.visible');
  });

  it('show creatine collections', () => {
    cy.visit('/');
    cy.get('[data-cy=nav-btn-essentials]').click();
    cy.get('[data-cy=nav-btn-creatine]').click();
    cy.location('pathname').should('equal', '/collections/creatine');
    cy.get('[data-cy=product-collection-creatine]').should('be.visible');
  });

  it('show multivitamin collections', () => {
    cy.visit('/');
    cy.get('[data-cy=nav-btn-more]').click();
    cy.get('[data-cy=nav-btn-multivitamin]').click();
    cy.location('pathname').should('equal', '/collections/multivitamin');
    cy.get('[data-cy=product-collection-multivitamin]').should('be.visible');
  });

  it('show omega/fishoil collections', () => {
    cy.visit('/');
    cy.get('[data-cy=nav-btn-more]').click();
    cy.get('[data-cy=nav-btn-omega]').click();
    cy.location('pathname').should('equal', '/collections/omega');
    cy.get('[data-cy=product-collection-omega]').should('be.visible');
  });
});
