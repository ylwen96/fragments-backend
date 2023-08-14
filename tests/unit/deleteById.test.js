const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments:id', () => {
  // authenticated vs unauthenticated requests (use HTTP Basic Auth, don't worry about Cognito in tests)
  test('unauthenticated user, access should denied', () =>
    request(app)
      .delete(`/v1/fragments/123`)
      .expect(401)
  );

  test('incorrect credentials are denied', () =>
    request(app)
      .delete(`/v1/fragments/123`)
      .auth('user1@email.com', 'wrongPassword')
      .expect(401)
  );

  test('authenticated users can delete a plain text fragment', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // trying to create a fragment with an support type errors but a not found id as expected
  test('authenticated users cannot delete a fragment with an not found id', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const res = await request(app)
      .delete('/v1/fragments/153')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});


