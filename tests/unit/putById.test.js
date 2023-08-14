const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments:id', () => {
  // authenticated vs unauthenticated requests (use HTTP Basic Auth, don't worry about Cognito in tests)
  test('unauthenticated user, access should denied', () =>
    request(app)
      .put('/v1/fragments/123')
      .expect(401)
  );

  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/123')
      .auth('user1@email.com', 'wrongPassword')
      .expect(401)
  );

  test('authenticated users can update a plain text fragment', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/html')
    expect(res.statusCode).toBe(200);
  });

  // trying to create a fragment with an unsupported type errors as expected
  test('authenticated users cannot create a fragment with an unsupported type errors as expected', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/html')
    const id = fragment.body.fragment.id;
    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/wrong');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });

  // trying to create a fragment with an support type errors but a not found id as expected
  test('authenticated users cannot create a fragment with an not found id', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')

    const res = await request(app)
      .put('/v1/fragments/153')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});


