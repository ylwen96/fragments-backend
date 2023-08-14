// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request cannot be found, it should show 404 status
  test('requests cannot be found', () => request(app).get('/wrong-url').expect(404));
});
