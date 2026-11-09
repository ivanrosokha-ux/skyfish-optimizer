describe('E2E User Journey: Profile Exploration & Gear Inspection Flow', () => {
  it('explores profile, switches profiles dynamically, searches players, and opens optimizer', () => {
    // 1. Visit Homepage (Profile)
    cy.visit('/');
    cy.contains('Fishing stats for ReefRunner on Lime').should('be.visible');
    cy.contains("Diver's Mask").should('be.visible');
    cy.contains('Rod of the Sea').should('be.visible');
    cy.contains('64 %').should('be.visible');

    // 2. Switch profile to "Coconut"
    cy.contains('button', 'Coconut').click();
    cy.contains('Water Hydra Head').should('be.visible');
    cy.contains('Chum Rod').should('be.visible');
    cy.contains('48 %').should('be.visible');

    // 3. Switch profile to "Papaya"
    cy.contains('button', 'Papaya').click();
    cy.contains('Angler Helmet').should('be.visible');
    cy.contains('35 %').should('be.visible');

    // 4. Search another player (e.g., Technoblade)
    cy.get('input[placeholder="ReefRunner"]').clear().type('Technoblade');
    cy.contains('button', 'Search').click();

    // 5. Verify dynamic route and updated player gear
    cy.url().should('include', '/profile/Technoblade');
    cy.contains('Thunder Helmet').should('be.visible');
    cy.contains('Hellfire Rod').should('be.visible');
    cy.contains('92 %').should('be.visible');
    cy.contains('Fishing 50').should('be.visible');

    // 6. Navigate to Optimizer via in-page link
    cy.contains('a', 'Open optimizer →').click();
    cy.url().should('include', '/optimizer');
    cy.contains('h1', 'Optimizer').should('be.visible');
  });
});
