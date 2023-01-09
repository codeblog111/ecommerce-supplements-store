/// <reference types="Cypress" />

describe('CartScreen', () => {
  before(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');

    // Seed database
    cy.exec('npm run data-test:import');

    cy.registerUserIfNeeded();

    // Visit the site
    cy.visit('/');
  });

  beforeEach(() => {
    // Visit the site
    cy.visit('/');
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('can click on cart icon on header and go to cart screen', () => {
    // Make sure at home screen
    cy.location('pathname').should('equal', '/');

    // Click the cart button
    cy.get('[data-cy=nav-btn-cart]').click();

    // Check elements in the screen
    cy.contains('Shopping Cart').should('be.visible');

    // Make sure the cart is empty
    cy.get('.alert').should('contain', 'Your Cart is Empty');

    // Check the screen path
    cy.location('pathname').should('eq', '/cart');
    cy.location('pathname').should('not.eq', '/');
  });

  it('can add items to cart', () => {
    // Click the first latest product
    cy.get('[data-cy=latest-products] > div > a').eq(0).click();

    // Click add to cart button
    cy.get('[data-cy=btn-add-to-cart]').click();

    // Check the screen path
    cy.location('pathname').should('contain', '/cart');

    // Check number of items in the cart
    cy.get('[data-cy=cart-item]').should('have.length', 1);

    // Go back to home
    cy.visit('/');

    // Click the second latest product
    cy.get('[data-cy=latest-products] > div > a').eq(1).click();

    // Click add to cart button
    cy.get('[data-cy=btn-add-to-cart]').click();

    // Check the screen path
    cy.location('pathname').should('contain', '/cart');

    // Check number of items in the cart
    cy.get('[data-cy=cart-item]').should('have.length', 2);
  });

  it('non login user can not go to checkout page from cart', () => {
    // Click the first latest product
    cy.get('[data-cy=latest-products] > div > a').eq(0).click();

    // Click add to cart button
    cy.get('[data-cy=btn-add-to-cart]').click();

    // Click proceed to checkout
    cy.get('[data-cy=btn-proceed-to-checkout').click();

    // redirect to login screen
    cy.location('pathname').should('contain', '/login');
  });

  it('login user can go to checkout page from cart', () => {
    cy.loginUser();

    // After login make sure redirect to home screen
    cy.location('pathname').should('eq', '/');

    // Click the first latest product
    cy.get('[data-cy=latest-products] > div > a').eq(0).click();

    // Click add to cart button
    cy.get('[data-cy=btn-add-to-cart]').click();

    // Click proceed to checkout
    cy.get('[data-cy=btn-proceed-to-checkout').click();

    // redirect to shipping screen
    cy.location('pathname').should('contain', '/shipping');
  });
});
