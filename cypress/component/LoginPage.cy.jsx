import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../src/pages/LoginPage';

describe('Component Test: LoginPage', () => {
  it('renders login form by default and allows switching to register tab', () => {
    cy.mount(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Initial state: login
    cy.contains('button', 'Log in').should('be.visible');

    // Switch to Register
    cy.contains('button', 'Register').click();
    cy.contains('button', 'Register').should('be.visible');

    // Switch back to Login
    cy.contains('button', 'Login').click();
    cy.contains('button', 'Log in').should('be.visible');
  });

  it('allows user to type credentials into inputs', () => {
    cy.mount(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    cy.get('input[type="email"]').clear().type('custom_fisher@test.com');
    cy.get('input[type="email"]').should('have.value', 'custom_fisher@test.com');

    cy.get('input[type="password"]').clear().type('secretpass999');
    cy.get('input[type="password"]').should('have.value', 'secretpass999');
  });
});
