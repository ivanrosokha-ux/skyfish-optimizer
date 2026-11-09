import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '../../src/pages/NotFoundPage';

describe('Component Test: NotFoundPage', () => {
  it('renders 404 code, ocean icon, and return link', () => {
    cy.mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    cy.contains('404').should('be.visible');
    cy.contains('Нічого не спіймано!').should('be.visible');
    cy.contains('Повернутися на головну').should('have.attr', 'href', '/');
  });
});
