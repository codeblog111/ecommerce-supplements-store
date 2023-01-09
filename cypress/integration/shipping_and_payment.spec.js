/// <reference types="Cypress" />

describe('Shipping and Payments', () => {
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
    cy.loginUser();
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('go from cart to order screen', () => {
    const shippingAddress = {
      address: '123 street',
      city: 'foo',
      postalCode: '1234',
      country: 'bar',
    };

    cy.location('pathname').should('equal', '/');

    // Click the first latest product
    cy.get('[data-cy=latest-products] > div > a').eq(0).click();

    // Click add to cart button
    cy.get('[data-cy=btn-add-to-cart]').click();

    // Click proceed to checkout
    cy.get('[data-cy=btn-proceed-to-checkout').click();

    // Redirect to shipping screen
    cy.location('pathname').should('contain', '/shipping');

    // Fill the shipping information
    cy.get('[data-cy=form-address]').type(shippingAddress.address);
    cy.get('[data-cy=form-city]').type(shippingAddress.city);
    cy.get('[data-cy=form-postal-code]').type(shippingAddress.postalCode);
    cy.get('[data-cy=form-country]').type(shippingAddress.country);

    // Click countinue
    cy.get('[data-cy=btn-continue]').click();

    // Redirect to payment screen
    cy.location('pathname').should('contain', '/payment');

    cy.contains('PAYMENT METHOD').should('be.visible');
    cy.contains('PayPal').should('be.visible');

    // Click countinue
    cy.get('[data-cy=btn-continue]').click();

    // Redirect to place order screen
    cy.location('pathname').should('contain', '/placeorder');

    // Check the address
    cy.contains(shippingAddress.address).should('be.visible');

    // Check the items
    cy.get('[data-cy=order-item]').should('have.length', 1);

    // Click place order button
    cy.get('[data-cy=btn-place-order]').click();

    // Redirect to order screen for payment
    cy.location('pathname').should('contain', '/order');

    cy.get('.alert').should('contain', 'Not Delivered');
    cy.get('.alert').should('contain', 'Not Paid');
  });
});
