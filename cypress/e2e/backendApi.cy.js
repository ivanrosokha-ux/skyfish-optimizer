describe('SkyFish Optimizer - Backend API Integration (Node / Express)', () => {
  const API_URL = 'http://localhost:5000/api';

  it('GET /api/health returns online status and metadata', () => {
    cy.request(`${API_URL}/health`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'online');
      expect(response.body).to.have.property('service', 'SkyFish Optimizer API');
    });
  });

  it('GET /api/upgrades returns items with prices and stat gains', () => {
    cy.request(`${API_URL}/upgrades`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      expect(response.body.data[0]).to.have.property('price');
      expect(response.body.data[0]).to.have.property('gain');
    });
  });

  it('GET /api/player/:nickname returns fishing statistics and equipped gear', () => {
    cy.request(`${API_URL}/player/ReefRunner?profile=Lime`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.username).to.eq('ReefRunner');
      expect(response.body.profile).to.eq('Lime');
      expect(response.body.stats).to.have.property('scc', 64);
      expect(response.body.stats).to.have.property('fishingSpeed', 180);
      expect(response.body.armor).to.be.an('array');
    });
  });

  it('POST /api/auth/login validates credentials and issues token', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/auth/login`,
      body: {
        email: 'angler@example.com',
        password: 'password123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body).to.have.property('token');
      expect(response.body.user).to.have.property('email', 'angler@example.com');
    });
  });

  it('POST & DELETE /api/builds performs CRUD operations on user builds', () => {
    // 1. Create build
    cy.request({
      method: 'POST',
      url: `${API_URL}/builds`,
      body: {
        name: 'Thunder 10M Build',
        scc: 78,
        speed: 210,
        cost: 8500000,
      },
    }).then((postRes) => {
      expect(postRes.status).to.eq(201);
      const createdId = postRes.body.data.id;
      expect(createdId).to.be.a('string');

      // 2. Delete build
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/builds/${createdId}`,
      }).then((delRes) => {
        expect(delRes.status).to.eq(200);
        expect(delRes.body.success).to.be.true;
      });
    });
  });
});
