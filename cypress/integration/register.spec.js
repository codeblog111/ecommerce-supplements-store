/// <reference types="Cypress" />

describe('Register', () => {
  beforeEach(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');

    // Seed database
    cy.exec('npm run data-test:import');

    // Visit the site
    cy.visit('/');
  });

  afterEach(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('registers new user', () => {
    const username = 'visitor';
    const email = 'visitor@email.com';
    const password = 'visiting';

    cy.contains('Sign-in').click();
    cy.contains('Register').click();
    cy.location('pathname').should('equal', '/register');
    cy.contains('Name').type(username);
    cy.contains('Email Address').type(email);
    cy.contains('Password').type(password);
    cy.contains('Confirm Password').type(password);
    cy.get('.btn').contains('Register').click();

    cy.location('pathname').should('equal', '/');
    cy.get('[data-cy=username]').should('be.visible');
  });
});
