describe('E2E User Journey: Authentication & Account Management Flow', () => {
  beforeEach(() => {
    // Clear localStorage to start with a fresh session
    cy.clearLocalStorage();
  });

  it('completes the full flow: login -> manage nickname -> compare builds -> logout', () => {
    // 1. Visit Login page
    cy.visit('/login');
    cy.contains('h1, button', 'Log in').should('be.visible');

    // 2. Fill login credentials
    cy.get('input[type="email"]').clear().type('angler@example.com');
    cy.get('input[type="password"]').clear().type('password123');

    // 3. Submit form
    cy.get('button[type="submit"]').click();

    // 4. Verify automatic redirect to Account page
    cy.url().should('include', '/account');
    cy.contains('Account details').should('be.visible');
    cy.contains('Signed in').should('be.visible');
    cy.get('input[value="angler@example.com"]').should('be.visible');

    // 5. Update default nickname
    cy.get('input[placeholder="ReefRunner"], input[value="ReefRunner"]')
      .clear()
      .type('MasterAngler99');
    cy.contains('button', 'Save').click();
    cy.contains('✓ Нікнейм оновлено!').should('be.visible');

    // 6. Test dynamic "Before vs After" build comparison matrix
    cy.contains('Compare builds').should('be.visible');
    cy.get('select').first().select('Everyday fishing');
    cy.get('select').last().select('SCC · 5M plan');
    cy.contains('+6 pp').should('be.visible');

    // 7. Delete a build if multiple exist
    cy.get('button[title="Видалити білд"]').first().click();

    // 8. Log out
    cy.contains('button', 'Log out').click();
    cy.url().should('include', '/login');
    cy.contains('Log in to sync your saved builds').should('be.visible');
  });
});
