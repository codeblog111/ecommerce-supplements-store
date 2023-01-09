/// <reference types="Cypress" />

describe('Profile Screen', () => {
  before(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');

    // Seed database
    cy.exec('npm run data-test:import');

    cy.registerUserIfNeeded();
    cy.createOrder();

    // Visit the site
    cy.visit('/');
  });

  beforeEach(() => {
    // Visit the site
    cy.visit('/');
    cy.loginUser();
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('go to profile screen', () => {
    cy.location('pathname').should('equal', '/');
    cy.get('[data-cy=username]').click();
    cy.get('[data-cy=nav-profile]').click();
    cy.location('pathname').should('equal', '/profile');
    cy.get('[data-cy=form-name]').should(
      'have.value',
      Cypress.env('user').name
    );
    cy.get('[data-cy=form-email]').should(
      'have.value',
      Cypress.env('user').email
    );

    // Check the order list
    cy.get('[data-cy=order-list]').should('have.have.length', 1);
  });

  it('update user name', () => {
    cy.location('pathname').should('equal', '/');
    cy.get('[data-cy=username]').click();
    cy.get('[data-cy=nav-profile]').click();
    cy.location('pathname').should('equal', '/profile');
    cy.get('[data-cy=form-name]').clear();
    cy.get('[data-cy=form-name]').type('updatedUser');
    cy.get('[data-cy=btn-update]').click();
    cy.get('.alert').should('contain', 'Profile Updated');
  });

  it('go to order screen by clicking order detail button', () => {
    cy.location('pathname').should('equal', '/');
    cy.get('[data-cy=username]').click();
    cy.get('[data-cy=nav-profile]').click();
    cy.location('pathname').should('equal', '/profile');

    // Go to order screen
    cy.get('[data-cy=btn-details]').click();
    cy.location('pathname').should('contain', '/order');
  });
});
