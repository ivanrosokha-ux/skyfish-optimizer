describe('SkyFish Optimizer Smoke Test', () => {
  it('loads the homepage successfully and shows navigation links', () => {
    cy.visit('/');
    cy.contains('SkyFish').should('be.visible');
    cy.contains('Profile').should('be.visible');
    cy.contains('Optimizer').should('be.visible');
    cy.contains('Account').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('can navigate between all 4 required pages', () => {
    cy.visit('/');
    cy.contains('Fishing stats').should('be.visible');

    cy.contains('Optimizer').click();
    cy.url().should('include', '/optimizer');
    cy.contains('Recommended upgrades').should('be.visible');

    cy.contains('Account').click();
    cy.url().should('include', '/account');
    cy.contains('Account details').should('be.visible');

    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Log in to sync your saved builds').should('be.visible');
  });
});
