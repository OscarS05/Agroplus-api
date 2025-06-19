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

  beforeAll(async () => {
    app = await createApp();
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
  });

  describe('GET /animals', () => {
    test('It should return a list of animals from user1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.animals).toHaveLength(3);
      expect(body.animals[0].id).toEqual(animalsUsr1[0].id);
      expect(body.animals[0].user.id).toEqual(animalsUsr1[0].userId);
    });

    test('It should return a list of animals filtered by sex.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals?sex=Female')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.animals).toHaveLength(2);
      expect(body.animals[0].id).toEqual(animalsUsr1[1].id);
      expect(body.animals[0].user.id).toEqual(animalsUsr1[1].userId);
    });

    test('It should return a list of animals filtered by breed.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals?breed=angus')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.animals).toHaveLength(3);
      expect(body.animals[0].id).toEqual(animalsUsr1[0].id);
      expect(body.animals[0].user.id).toEqual(animalsUsr1[0].userId);
    });

    test('It should return an error because the query is not allowed.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals?father=abc-123')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return a list of animals from user2.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals')
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(200);
      expect(body.animals).toHaveLength(3);
      expect(body.animals[0].id).toEqual(animalsUsr2[0].id);
      expect(body.animals[0].user.id).toEqual(animalsUsr2[0].userId);
    });

    test('It should return an error because the token is invalid.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals')
        .set('Cookie', `accessToken=fake-token-123`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/malformed/);
    });
  });

  describe('POST /animals', () => {
    test('It should return a new animal.', async () => {
      const inputBody = {
        livestockType: 'Bovino',
        animalType: 'Cow',
        code: 'BOV-001',
        breed: 'Angus',
        sex: 'Female',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/animals`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.animal.code).toBe(inputBody.code);
    });

    test('It should return a new animal with parents.', async () => {
      const inputBody = {
        livestockType: 'Bovino',
        animalType: 'Cow',
        code: 'BOV-001',
        breed: 'Angus',
        sex: 'Female',
        fatherId: animalsUsr1[0].id,
        motherId: animalsUsr1[1].id,
      };

      const { statusCode, body } = await api
        .post(`/api/v1/animals`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.animal.code).toBe(inputBody.code);
      expect(body.animal.father).toBe(animalsUsr1[0].code);
      expect(body.animal.mother).toBe(animalsUsr1[1].code);
    });

    test('It should return an error because the data is invalid.', async () => {
      const inputBody = {
        livestockType: 'Bovino',
        animalType: 'Cow',
        code: 'BOV-001',
        sex: 'Female',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/animals`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is required/);
    });

    test('It should return an error because the fatherId does not exist or does not belong to the user.', async () => {
      const inputBody = {
        livestockType: 'Bovino',
        animalType: 'Cow',
        code: 'BOV-001',
        breed: 'Angus',
        sex: 'Female',
        fatherId: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
        motherId: 'e9ea0cea-62de-47be-b17a-4f6609e945a4',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/animals`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/does not exist/);
    });
  });

  describe('PATCH /animals/{animalId}', () => {
    test('It should return an updated animal.', async () => {
      const inputBody = {
        sex: 'Male',
      };

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/${animalsUsr1[2].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.animal.id).toBe(animalsUsr1[2].id);
      expect(body.animal.sex).not.toBe(animalsUsr1[2].sex);
      expect(body.animal.sex).toBe(inputBody.sex);
    });

    test('It should return an error because there are not data to update.', async () => {
      const inputBody = {};

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/${animalsUsr1[2].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/No data was provided/);
    });

    test('It should return an error because the animal does not belong to the user2 or does not exist.', async () => {
      const inputBody = {
        sex: 'Male',
      };

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/${animalsUsr1[2].id}`)
        .set('Cookie', `accessToken=${accessTokenUser2}`)
        .send(inputBody);

      expect(statusCode).toBe(409);
      expect(body.message).toMatch(/does not belong to the user/);
    });

    test('It should return an error because the animal does not belong to the user2 or does not exist.', async () => {
      const inputBody = {
        fatherId: 'c36b4f45-35f9-4d77-9669-e55eb7d33405',
      };

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/${animalsUsr1[2].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/does not exist/);
    });
  });

  describe('DELETE /animals/{animalId}', () => {
    test('It should return a 200 statusCode and 1 affectedRows when deleting an animal(Father).', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/${animalsUsr1[0].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.affectedRows).toBe(1);

      const animalYoungAfterDeleteItsFather = await models.Animal.findOne({
        where: { userId: user1.id, code: 'HIJ-123' },
      });

      expect(animalYoungAfterDeleteItsFather.id).toBe(animalsUsr1[2].id);
      expect(animalYoungAfterDeleteItsFather.fatherId).toBe(null);
    });

    test('It should return an error because the animalId does not exist or does not belong to the user.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/c36b4f45-35f9-4d77-9669-e55eb7d33405`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/does not exist/);
    });

    test('It should return a 200 statusCode and 1 affectedRows when deleting an animal(Young).', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/${animalsUsr1[2].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.affectedRows).toBe(1);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
