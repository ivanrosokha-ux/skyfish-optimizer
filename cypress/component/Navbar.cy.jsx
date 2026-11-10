import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../src/components/layout/Navbar';

describe('Component Test: Navbar', () => {
  it('renders logo and all 4 navigation links', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    cy.contains('SkyFish').should('be.visible');
    cy.contains('Profile').should('be.visible');
    cy.contains('Optimizer').should('be.visible');
    cy.contains('Account').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('marks the active route with active styling', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/optimizer']}>
        <Navbar />
      </MemoryRouter>
    );

    cy.contains('a', 'Optimizer').should('have.attr', 'href', '/optimizer');
  });
});
