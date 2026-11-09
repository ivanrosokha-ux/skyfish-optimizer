import Footer from '../../src/components/layout/Footer';

describe('Component Test: Footer', () => {
  it('renders footer content and disclaimers correctly', () => {
    cy.mount(<Footer />);
    cy.contains('SkyFish Optimizer').should('be.visible');
    cy.contains('Built for Hypixel SkyBlock players').should('be.visible');
    cy.contains('Not affiliated with Hypixel Inc.').should('be.visible');
  });
});
