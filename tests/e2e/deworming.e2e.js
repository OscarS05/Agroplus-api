const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for user endpoints', () => {
  let app = null;
  let server = null;
  let api = null;

  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let user1 = null;
  let user2 = null;
  let animalsUsr1 = null;
  let animalsUsr2 = null;
  let dewormingsAnimalsUsr1 = null;

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

    const [animalsUser1, animalsUser2] = await Promise.all([
      models.Animal.findAll({
        where: { userId: user1.id },
      }),
      models.Animal.findAll({
        where: { userId: user2.id },
      }),
    ]);

    animalsUsr1 = animalsUser1;
    animalsUsr2 = animalsUser2;

    const [dewormings1, ,] = await Promise.all([
      models.Deworming.findAll({
        include: [
          {
            model: models.Animal,
            as: 'animal',
            attributes: [],
            where: { userId: user1.id },
          },
        ],
      }),
      models.Deworming.findAll({
        include: [
          {
            model: models.Animal,
            as: 'animal',
            attributes: [],
            where: { userId: user2.id },
          },
        ],
      }),
    ]);

    dewormingsAnimalsUsr1 = dewormings1;
  });

  describe('GET /animals/deworming', () => {
    test('It should return a list of dewormings from user1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/deworming')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.deworming).toHaveLength(4);
      expect(body.deworming[0].id).toEqual(dewormingsAnimalsUsr1[0].id);
      expect(body.deworming[0].animal.id).toEqual(
        dewormingsAnimalsUsr1[0].animalId,
      );
    });

    test('It should return a list of dewormings from user2.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/deworming')
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(200);
      expect(body.deworming).toHaveLength(0);
    });

    test('It should return an error because the query is not allowed.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/deworming?sex=Female')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return an empty array because the dewormer does not exist.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/deworming?dewormer=dewormer-x')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.deworming).toHaveLength(0);
    });

    test('It should return an array with 1 deworming because the match is only 1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/deworming?dewormer=2%')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.deworming).toHaveLength(1);
    });
  });

  describe('POST /animals/{animalId}/deworming', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        dewormer: 'ivermectin 5%',
      };
    });

    test('It should return a new deworming without description.', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr1[0].id}/deworming`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.deworming.dewormer).toBe(inputBody.dewormer);
      expect(body.deworming.description).toBe(null);
      expect(body.deworming.animal.id).toBe(animalsUsr1[0].id);
      expect(body.deworming.animal.code).toBe(animalsUsr1[0].code);
    });

    test('It should return a new deworming with description.', async () => {
      inputBody.description = 'The description is x';

      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr1[0].id}/deworming`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.deworming.dewormer).toBe(inputBody.dewormer);
      expect(body.deworming.description).toBe(inputBody.description);
      expect(body.deworming.animal.id).toBe(animalsUsr1[0].id);
      expect(body.deworming.animal.code).toBe(animalsUsr1[0].code);
    });

    test('It should return an error because the deworming does not belong to the user', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr2[0].id}/deworming`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(404);
      expect(body.message).toMatch(/does not exist/);
    });

    test('It should return an error because the data is invalid.', async () => {
      inputBody.register = new Date();

      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr2[0].id}/deworming`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return an error because the data is invalid.', async () => {
      delete inputBody.dewormer;

      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr2[0].id}/deworming`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/was not provided|is required/);
    });
  });

  describe('PATCH /animals/deworming/{dewormingId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        dewormer: 'dewormer-y',
      };
    });

    test('It should return an updated deworming updating only the dewormer.', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/animals/deworming/${dewormingsAnimalsUsr1[0].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.deworming.id).toBe(dewormingsAnimalsUsr1[0].id);
      expect(body.deworming.dewormer).not.toBe(
        dewormingsAnimalsUsr1[0].dewormer,
      );
      expect(body.deworming.dewormer).toBe(inputBody.dewormer);
      expect(body.deworming.description).toBe(
        dewormingsAnimalsUsr1[0].description,
      );
    });

    test('It should return an updated deworming updating only the description.', async () => {
      delete inputBody.dewormer;
      inputBody.description = 'updated description';

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/deworming/${dewormingsAnimalsUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.deworming.id).toBe(dewormingsAnimalsUsr1[1].id);
      expect(body.deworming.dewormer).toBe(dewormingsAnimalsUsr1[1].dewormer);
      expect(body.deworming.description).not.toBe(
        dewormingsAnimalsUsr1[1].description,
      );
    });

    test('It should return an error because the data to update was not provided.', async () => {
      delete inputBody.dewormer;

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/deworming/${dewormingsAnimalsUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/was not provided/);
    });

    test('It should return an error because the deworming does not belong to the user2 or does not exist.', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/animals/deworming/${dewormingsAnimalsUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser2}`)
        .send(inputBody);

      expect(statusCode).toBe(409);
      expect(body.message).toMatch(/does not exist|does not belong/);
    });
  });

  describe('DELETE /animals/deworming/{dewormingId}', () => {
    test('It should return a 200 statusCode and 1 affectedRows.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/deworming/${dewormingsAnimalsUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.affectedRows).toBe(1);
    });

    test('It should return an error because the animalId does not exist or does not belong to the user2.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/deworming/${dewormingsAnimalsUsr1[0].id}`)
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(409);
      expect(body.message).toMatch(/does not exist/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
