describe('SkyFish Optimizer - Client-Side Routing (React Router v6)', () => {
  it('navigates seamlessly across all main routes via Navbar', () => {
    cy.visit('/');
    cy.contains('Fishing stats').should('be.visible');

    // Go to Optimizer
    cy.contains('nav a', 'Optimizer').click();
    cy.url().should('include', '/optimizer');
    cy.contains('Recommended upgrades').should('be.visible');

    // Go to Account
    cy.contains('nav a', 'Account').click();
    cy.url().should('include', '/account');
    cy.contains('Account details').should('be.visible');

    // Go to Login
    cy.contains('nav a', 'Login').click();
    cy.url().should('include', '/login');
    cy.contains('Log in to sync your saved builds').should('be.visible');

    // Go back to Profile
    cy.contains('nav a', 'Profile').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Fishing stats').should('be.visible');
  });

  it('supports dynamic routing with useParams (/profile/:player)', () => {
    cy.visit('/profile/Technoblade');
    cy.contains('Technoblade').should('be.visible');
    cy.url().should('include', '/profile/Technoblade');
  });

  it('performs programmatic navigation via search input', () => {
    cy.visit('/');
    cy.get('input[placeholder="ReefRunner"]').clear().type('SharkHunter');
    cy.contains('button', 'Search').click();
    cy.url().should('include', '/profile/SharkHunter');
    cy.contains('SharkHunter').should('be.visible');
  });

  it('performs programmatic navigation on login form submit', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('angler@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('button', 'Log in').click();
    cy.url().should('include', '/account');
    cy.contains('Account details').should('be.visible');
  });

  it('renders 404 NotFoundPage for unknown routes and allows return to home', () => {
    cy.visit('/some/missing/route', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
    cy.contains('Нічого не спіймано!').should('be.visible');

    cy.contains('Повернутися на головну').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Fishing stats').should('be.visible');
  });
});
