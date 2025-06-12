const request = require('supertest');

const createApp = require('../../api/app');
// const { models } = require('../../api/src/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for user endpoints', () => {
  let app = null;
  let server = null;
  let api = null;

  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let user1 = null;
  let user2 = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);

    await upSeed();

    // auth user1
    const { body, headers } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user1@email.com', password: 'Admin123@' });

    const setCookie = headers['set-cookie'];
    const accessTokenCookieString = setCookie.find((cookie) =>
      cookie.startsWith('accessToken='),
    );
    const [, accessToken] = accessTokenCookieString.split(';')[0].split('=');
    accessTokenUser1 = accessToken;
    user1 = body.user;

    // auth user1
    const { body: bodyUsr2, headers: headersUsr2 } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user2@email.com', password: 'Customer123@' });

    const setCookieUsr2 = headersUsr2['set-cookie'];
    const accessTokenCookieStringUsr2 = setCookieUsr2.find((cookie) =>
      cookie.startsWith('accessToken='),
    );
    const [, accessTokenUsr2] = accessTokenCookieStringUsr2
      .split(';')[0]
      .split('=');
    accessTokenUser2 = accessTokenUsr2;
    user2 = bodyUsr2.user;
  });

  describe('GET /users/', () => {
    test('It should return a list of users.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/users')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.users).toHaveLength(2);
    });

    test('It should return a list of users.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/users')
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(200);
      expect(body.users).toHaveLength(2);
    });

    test('It should return a list of users.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/users')
        .set('Cookie', `accessToken=fake-token-123`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/malformed/);
    });
  });

  describe('GET /users/{email}', () => {
    test('It should return an specific user by email.', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/users/${user1.email}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.user.id).toBe(user1.id);
      expect(body.user.email).toBe(user1.email);
    });

    test('It should return a list of users.', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/users/${user2.email}`)
        .set('Cookie', `accessToken=fake-token-123`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/malformed/);
    });
  });

  describe('POST /auth/sign-up', () => {
    test('It should return a new user.', async () => {
      const inputBody = {
        email: 'admin@email.com',
        name: 'admin name',
        password: 'O123456@k',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/auth/sign-up`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.user.email).toBe(inputBody.email);
    });

    test('It should return an error because the email is invalid.', async () => {
      const inputBody = {
        email: 'ad``min@email.com',
        name: 'admin name',
        password: 'O123456@k',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/auth/sign-up`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/fails to match the required pattern/);
    });

    test('It should return an error because the password is invalid.', async () => {
      const inputBody = {
        email: 'admin@email.com',
        name: 'admin name **',
        password: 'wrong-password',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/auth/sign-up`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/fails to match the required pattern/);
    });
  });

  describe('POST /auth/login', () => {
    test('It should return a success message.', async () => {
      const inputBody = {
        email: 'admin@email.com',
        password: 'O123456@k',
      };

      const { statusCode, body, headers } = await api
        .post(`/api/v1/auth/login`)
        .send(inputBody);

      const setCookie = headers['set-cookie'];
      const accessTokenCookieString = setCookie.find((cookie) =>
        cookie.startsWith('accessToken='),
      );
      const [, token] = accessTokenCookieString.split(';')[0].split('=');

      expect(statusCode).toBe(200);
      expect(token).toBeTruthy();
      expect(body.user.email).toBe(inputBody.email);
    });

    test('It should return an error because the password is invalid.', async () => {
      const inputBody = {
        email: 'admin@email.com',
        password: 'O123456*',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/auth/login`)
        .send(inputBody);

      expect(statusCode).toBe(401);
      expect(body.message).toMatch(/password is incorrect/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
