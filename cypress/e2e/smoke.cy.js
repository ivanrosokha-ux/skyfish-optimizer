describe('SkyFish Optimizer Smoke Test', () => {
  it('loads the homepage successfully and shows the title', () => {
    cy.visit('/');
    cy.contains('SkyFish').should('be.visible');
    cy.contains('Profile').should('be.visible');
    cy.contains('Optimizer').should('be.visible');
    cy.contains('Account').should('be.visible');
  });

  it('can navigate between pages', () => {
    cy.visit('/');
    cy.contains('Optimizer').click();
    cy.url().should('include', '/optimizer');
    cy.contains('Recommended upgrades').should('be.visible');

    cy.contains('Account').click();
    cy.url().should('include', '/account');
    cy.contains('Account details').should('be.visible');
  });
});
