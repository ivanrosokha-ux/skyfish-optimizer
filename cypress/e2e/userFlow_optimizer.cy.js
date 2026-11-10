describe('E2E User Journey: Gear Optimization & Knapsack Budget Allocation', () => {
  it('ranks upgrades, switches target stats, calculates budget, saves build, and verifies in account', () => {
    // 1. Visit Optimizer Page
    cy.visit('/optimizer');
    cy.contains('h1', 'Optimizer').should('be.visible');
    cy.contains('Recommended upgrades').should('be.visible');

    // 2. Verify upgrades are ranked
    cy.contains('Angler V').should('be.visible');
    cy.contains('Submerged').should('be.visible');

    // 3. Switch Target Stat to "Fishing Speed"
    cy.contains('button', 'Fishing Speed').click();
    cy.contains('Blessing V').should('be.visible');

    // Switch back to "SCC"
    cy.contains('button', 'SCC').click();
    cy.contains('Angler V').should('be.visible');

    // 4. Toggle Filter Chip (e.g. uncheck "Enchantments")
    cy.contains('button', 'Enchantments').click();
    cy.contains('Angler V').should('not.exist');
    // Turn "Enchantments" back on
    cy.contains('button', 'Enchantments').click();
    cy.contains('Angler V').should('be.visible');

    // 5. Test Budget Calculator with 8,000,000 coins
    cy.get('input[type="number"]').clear().type('8000000');
    cy.contains('button', 'Calculate').click();

    // Verify recommendations
    cy.contains('Recommended purchases').should('be.visible');
    cy.contains('Projected Sea Creature Chance').should('be.visible');

    // 6. Save build
    cy.contains('button', 'Save build').click();
    cy.contains('✓ Збережено:').should('be.visible');

    // 7. Navigate to Account page via Navbar
    cy.contains('nav a', 'Account').click();
    cy.url().should('include', '/account');

    // Verify the newly saved plan appears in Saved builds list
    cy.contains('Saved builds').should('be.visible');
    cy.contains('SCC ·').should('be.visible');
  });
});
