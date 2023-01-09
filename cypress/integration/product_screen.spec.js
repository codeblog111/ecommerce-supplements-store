/// <reference types="Cypress" />

describe('ProductScreen', () => {
  before(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');

    // Seed database
    cy.exec('npm run data-test:import');

    cy.registerUserIfNeeded();

    // Visit the site
    cy.visit('/');
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('can click a product in home screen and go to product screen', () => {
    // Make sure at home screen
    cy.location('pathname').should('equal', '/');

    // Click the first latest product
    cy.get('[data-cy=latest-products] > div > a').eq(0).click();

    // Check elements in the screen
    cy.get('[data-cy=btn-back]').should('be.visible');
    cy.get('[data-cy=btn-add-to-cart]').should('be.visible');

    // Check the screen path
    cy.location('pathname').should('contain', '/products');
  });

  it('login user can review a product', () => {
    cy.loginUser();

    // Make sure at home screen
    cy.location('pathname').should('equal', '/');

    // Click the first latest product
    cy.get('[data-cy=latest-products] > div > a').eq(0).click();

    // Check elements in the screen
    cy.get('[data-cy=btn-back]').should('be.visible');
    cy.get('[data-cy=btn-add-to-cart]').should('be.visible');

    // Check the screen path
    cy.location('pathname').should('contain', '/products');

    // Select rating
    cy.get('[data-cy=form-select]').select('5');

    // Add a comment
    cy.get('[data-cy=form-comment]').type('AWESOME PRODUCT!!');

    // Submit the review
    cy.get('[data-cy=btn-submit]').click();

    cy.wait(100);

    // Check after the review submission, the new review shows
    cy.contains('AWESOME PRODUCT!!').should('be.visible');
  });
});
