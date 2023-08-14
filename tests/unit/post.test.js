const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // authenticated vs unauthenticated requests (use HTTP Basic Auth, don't worry about Cognito in tests)
  test('unauthenticated user, access should denied', () =>
    request(app)
      .post('/v1/fragments')
      .expect(401)
  );

  test('incorrect credentials are denied', () =>
    request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'wrongPassword')
      .expect(401)
  );

  // authenticated users can create a plain text fragment
  // responses include all necessary and expected properties (id, created, type, etc), and these values match what you expect for a given request (e.g., size, type, ownerId)
  // responses include a Location header with a URL to GET the fragment
  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.type).toBe('text/plain');
  });

  // trying to create a fragment with an unsupported type errors as expected
  test('authenticated users cannot create a fragment with an unsupported type errors as expected', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/wrong');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });
});


