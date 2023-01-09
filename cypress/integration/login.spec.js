/// <reference types="Cypress" />

describe('site login', () => {
  before(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');

    // Seed database
    cy.exec('npm run data-test:import');

    // Register a user
    cy.registerUserIfNeeded();
  });

  beforeEach(() => {
    cy.visit('/');
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('does not work with wrong credentials', () => {
    cy.contains('Sign-in').click();

    cy.get('[data-cy=email]').type('wrong@email.com');
    cy.get('[data-cy=password]').type('no-such-user');

    cy.get('.btn').contains('Sign In').click();

    // Error message is shown and we remain on the login page
    cy.get('.alert').should('contain', 'Invalid password or user name');
    cy.url().should('contain', '/login');
  });

  it('logs in', () => {
    cy.contains('Sign-in').click();

    const user = Cypress.env('user');
    cy.contains('Email Address').type(user.email);
    cy.contains('Password').type(user.password);
    cy.get('.btn').contains('Sign In').click();

    // Url is /
    cy.url().should('not.contain', '/login');
    cy.location('pathname').should('equal', '/');

    // When we are logged in, there should be user icon visible
    cy.get('[data-cy=username]').should('be.visible');
  });
});
