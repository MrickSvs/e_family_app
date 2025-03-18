const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

describe('Family API Endpoints', () => {
  let authToken;
  let testFamilyId;

  // Données de test
  const testFamily = {
    family_name: "Famille Test",
    members: [
      {
        first_name: "John",
        last_name: "Doe",
        role: "Adulte"
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        role: "Enfant",
        birth_date: "2018-01-01"
      }
    ],
    travel_preferences: {
      travel_type: "Découverte",
      budget: "Modéré"
    }
  };

  beforeAll(async () => {
    // Ici, vous devriez ajouter la logique pour obtenir un token d'authentification
    // Par exemple, en vous connectant avec un utilisateur de test
    authToken = 'votre_token_de_test';
  });

  afterAll(async () => {
    // Nettoyage de la base de données
    if (testFamilyId) {
      await db.query('DELETE FROM families WHERE id = $1', [testFamilyId]);
    }
    await db.pool.end();
  });

  describe('POST /api/families', () => {
    it('devrait créer une nouvelle famille', async () => {
      const response = await request(app)
        .post('/api/families')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testFamily);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testFamily.family_name);
      testFamilyId = response.body.id;
    });

    it('devrait rejeter une famille sans membres', async () => {
      const invalidFamily = { ...testFamily, members: [] };
      const response = await request(app)
        .post('/api/families')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidFamily);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/families/:id', () => {
    it('devrait récupérer une famille par son ID', async () => {
      const response = await request(app)
        .get(`/api/families/${testFamilyId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testFamilyId);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const response = await request(app)
        .get('/api/families/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/families/:id', () => {
    it('devrait mettre à jour une famille', async () => {
      const update = {
        family_name: "Famille Test Modifiée",
        travel_preferences: {
          travel_type: "Culture",
          budget: "Confort"
        }
      };

      const response = await request(app)
        .put(`/api/families/${testFamilyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(update);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.family_name);
      expect(response.body.travel_preferences.travel_type).toBe(update.travel_preferences.travel_type);
    });
  });

  describe('GET /api/families', () => {
    it('devrait récupérer toutes les familles de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/api/families')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('DELETE /api/families/:id', () => {
    it('devrait supprimer une famille', async () => {
      const response = await request(app)
        .delete(`/api/families/${testFamilyId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Vérifier que la famille a bien été supprimée
      const checkResponse = await request(app)
        .get(`/api/families/${testFamilyId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(checkResponse.status).toBe(404);
    });
  });
}); 