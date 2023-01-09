/// <reference types="Cypress" />

describe('Admin actions', () => {
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
    cy.loginAdmin();
  });

  after(() => {
    // Clean up database
    cy.exec('npm run data-test:destroy');
  });

  it('check if the login user is admin', () => {
    //cy.contains('Sign-in').click();
    //cy.contains('Register').click();
    //cy.location('pathname').should('equal', '/register');
    //cy.contains('Name').type(username);
    //cy.contains('Email Address').type(email);
    //cy.contains('Password').type(password);
    //cy.contains('Confirm Password').type(password);
    //cy.get('.btn').contains('Register').click();

    //cy.location('pathname').should('equal', '/');
    //cy.get('[data-cy=username]').should('be.visible');

    cy.location('pathname').should('equal', '/');
    cy.get('[data-cy=nav-btn-admin]').should('be.visible');
  });

  it('admin can go to users list and edit', () => {
    cy.get('[data-cy=nav-btn-admin]').click();
    cy.get('[data-cy=nav-btn-users]').click();
    cy.location('pathname').should('equal', '/admin/userlist');

    // Check number of users
    cy.get('[data-cy=user-list]').should('have.length', 3 + 1);

    // Check number of admin
    cy.get('[data-cy=user-admin]').should('have.length', 1);

    // Check number of non-admin
    cy.get('[data-cy=user-normal]').should('have.length', 2 + 1);

    // Change a normal user into admin
    cy.get('[data-cy=btn-JohnDoe-edit]').click();
    cy.contains('Is Admin').click();
    cy.contains('Update').click();
    cy.location('pathname').should('equal', '/admin/userlist');

    // Check number of admin
    cy.get('[data-cy=user-admin]').should('have.length', 2);

    // Check number of non-admin
    cy.get('[data-cy=user-normal]').should('have.length', 2);

    // Delete a user
    cy.get('[data-cy=btn-JaneDoe-delete]').click();
    cy.on('window:confirm', () => true);

    // Check number of users
    cy.get('[data-cy=user-list]').should('have.length', 3);
  });

  it('admin can go to products list and create, edit, delete', () => {
    cy.get('[data-cy=nav-btn-admin]').click();
    cy.get('[data-cy=nav-btn-products]').click();
    cy.location('pathname').should('equal', '/admin/productlist');

    // Create a product
    cy.get('[data-cy=btn-create-product]').click();
    cy.location('pathname').should('contain', '/edit');
    cy.get('[data-cy=form-name]').should('contain.value', 'Sample');
    cy.get('[data-cy=form-name]').clear();
    cy.get('[data-cy=form-name]').type('testproduct');
    cy.get('[data-cy=btn-update]').click();

    // After create product it go back to product list page
    cy.location('pathname').should('equal', '/admin/productlist');

    // Check the new product
    cy.contains('testproduct').should('be.visible');

    // Edit the product
    cy.get('[data-cy=btn-testproduct-edit]').click();
    cy.location('pathname').should('contain', '/edit');
    cy.get('[data-cy=form-name]').should('contain.value', 'testproduct');
    cy.get('[data-cy=form-name]').clear();
    cy.get('[data-cy=form-name]').type('updatedproduct');
    cy.get('[data-cy=btn-update]').click();

    // After edit product it go back to product list page
    cy.location('pathname').should('equal', '/admin/productlist');

    // Check the edit product
    cy.contains('updatedproduct').should('be.visible');

    // Delete a product
    cy.get('[data-cy=btn-updatedproduct-delete]').click();
    cy.on('window:confirm', () => true);

    // Check if the product removed from the list
    cy.contains('updatedproduct').should('not.exist');
  });

  it('admin can go to order list', () => {
    const { name, email } = Cypress.env('user');
    cy.get('[data-cy=nav-btn-admin]').click();
    cy.get('[data-cy=nav-btn-orders]').click();
    cy.location('pathname').should('equal', '/admin/orderlist');

    // Shoud see a order created by testuser
    cy.contains(name).should('be.visible');

    // Check the order details
    cy.get('[data-cy=btn-details-0]').click();
    cy.location('pathname').should('contain', '/order');
    cy.contains(name).should('be.visible');
    cy.contains(email).should('be.visible');
    cy.get('.alert').should('contain', 'Not Delivered');
    cy.get('.alert').should('contain', 'Not Paid');
  });
});
