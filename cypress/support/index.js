// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Activate theme
// require('cypress-dark/src/halloween');
require('cypress-dark');

const apiUrl = Cypress.env('apiUrl');

// Creates a user with email and password
// defined in cypress.json environment variables
// if the user already exists, ignores the error
// or given user info parameters
Cypress.Commands.add('registerUserIfNeeded', (options = {}) => {
  const defaults = {
    ...Cypress.env('user'),
  };
  const user = Cypress._.defaults({}, options, defaults);
  cy.request({
    method: 'POST',
    url: `${apiUrl}/api/users`,
    body: {
      ...user,
    },
    failOnStatusCode: false,
  });
});

// Get logged in token
Cypress.Commands.add('getToken', (user = Cypress.env('user')) => {
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/api/users/login`,
      body: {
        email: user.email,
        password: user.password,
      },
      failOnStatusCode: false,
    })
    .its('body.token')
    .should('exist');
});

// Login user via UI
Cypress.Commands.add('loginUser', (user = Cypress.env('user')) => {
  cy.visit('/login');
  cy.contains('Email Address').type(user.email);
  cy.contains('Password').type(user.password);
  cy.get('.btn').contains('Sign In').click();
});

// Login admin via UI
Cypress.Commands.add('loginAdmin', (admin = Cypress.env('admin')) => {
  cy.visit('/login');
  cy.contains('Email Address').type(admin.email);
  cy.contains('Password').type(admin.password);
  cy.get('.btn').contains('Sign In').click();
});

// Create product order
Cypress.Commands.add('createOrder', () => {
  cy.registerUserIfNeeded();
  cy.getToken().then((token) => {
    const authorization = `Bearer ${token}`;

    const order = {
      orderItems: [
        {
          _id: '60f718d112f3d301b82ff071',
          product: '60e70fcf9235547bb00c78b9',
          name: 'Optimum Nutrition Gold Standard 100% Whey Protein',
          image: '/images/OPT007_900x.png',
          price: 29.99,
          qty: 1,
        },
      ],
      shippingAddress: {
        address: '101 main street',
        city: 'Boston',
        postalCode: '1234',
        country: 'USA',
      },
      paymentMethod: 'PayPal',
      taxPrice: 8.25,
      shippingPrice: 100,
      totalPrice: 163.23,
    };
    const options = {
      method: 'POST',
      url: `${apiUrl}/api/orders`,
      headers: { authorization },
      body: {
        ...order,
      },
    };

    return cy.request(options).its('status').should('eq', 201);
  });
});
