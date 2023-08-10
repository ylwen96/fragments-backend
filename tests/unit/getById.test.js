// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments/123').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/123').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with no extension
  test('authenticated users get a fragments array', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
  });

  // .txt extension
  test('add .txt extension after id, should give text/plain type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.txt`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/plain');
  });

  // .md extension
  test('add .md extension after id, should give text/markdown type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/markdown')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.md`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/markdown');
  });

  test('add .md extension after id, but the original type is text/plain, should give an error', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.md`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });

  // .html extension
  test('add .html extension after id, should give text/html type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/html')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.html`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/html');
  });

  test('add .md extension after id, but the original type is text/plain, should give an error', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.md`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });

  // .png extension
  test('add .png extension after id, should give image/png type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'image/png')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.png`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('image/png');
  });

  test('add .png extension after id, but the original type is text/plain, should give an error', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.png`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
  // .jpg extension
  test('add .jpg extension after id, should give image/jpeg type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'image/jpeg')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.jpg`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('image/jpg');
  });

  test('add .jpg extension after id, but the original type is text/plain, should give an error', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.jpg`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
  // .webp extension
  test('add .webp extension after id, should give text/markdown type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'image/webp')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.webp`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('image/webp');
  });

  test('add .webp extension after id, but the original type is text/plain, should give an error', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.webp`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
  // .gif extension
  test('add .gif extension after id, should give text/markdown type', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'image/gif')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.gif`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('image/gif');
  });

  test('add .gif extension after id, but the original type is text/plain, should give an error', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
    const id = fragment.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}.gif`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
});
