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
  let vaccinationsAnimalUsr1 = null;

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

    const [vaccinations1, ,] = await Promise.all([
      models.Vaccination.findAll({
        include: [
          {
            model: models.Animal,
            as: 'animal',
            attributes: [],
            where: { userId: user1.id },
          },
        ],
      }),
      models.Vaccination.findAll({
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

    vaccinationsAnimalUsr1 = vaccinations1;
  });

  describe('GET /animals/vaccination', () => {
    test('It should return a list of vaccinations from user1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/vaccination')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.vaccinations).toHaveLength(4);
      expect(body.vaccinations[0].id).toEqual(vaccinationsAnimalUsr1[0].id);
      expect(body.vaccinations[0].animal.id).toEqual(
        vaccinationsAnimalUsr1[0].animalId,
      );
    });

    test('It should return a list of vaccinations from user2.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/vaccination')
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(200);
      expect(body.vaccinations).toHaveLength(0);
    });

    test('It should return an error because the query is not allowed.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/vaccination?sex=Female')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return an empty array because the vaccine does not exist.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/vaccination?vaccine=vaccine-x')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.vaccinations).toHaveLength(0);
    });

    test('It should return an array with 1 vaccination because the match is only 1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/animals/vaccination?vaccine=2%')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.vaccinations).toHaveLength(1);
    });
  });

  describe('POST /animals/{animalId}/vaccination', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        vaccine: 'ivermectin 5%',
      };
    });

    test('It should return a new vaccination without description.', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr1[0].id}/vaccination`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.vaccination.vaccine).toBe(inputBody.vaccine);
      expect(body.vaccination.description).toBe(null);
      expect(body.vaccination.animal.id).toBe(animalsUsr1[0].id);
      expect(body.vaccination.animal.code).toBe(animalsUsr1[0].code);
    });

    test('It should return a new vaccination without description.', async () => {
      inputBody.description = 'The description is x';

      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr1[0].id}/vaccination`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.vaccination.vaccine).toBe(inputBody.vaccine);
      expect(body.vaccination.description).toBe(inputBody.description);
      expect(body.vaccination.animal.id).toBe(animalsUsr1[0].id);
      expect(body.vaccination.animal.code).toBe(animalsUsr1[0].code);
    });

    test('It should return an error because the vaccination does not belong to the user', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr2[0].id}/vaccination`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(404);
      expect(body.message).toMatch(/does not exist/);
    });

    test('It should return an error because the data is invalid.', async () => {
      inputBody.register = new Date();

      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr2[0].id}/vaccination`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return an error because the data is invalid.', async () => {
      delete inputBody.vaccine;

      const { statusCode, body } = await api
        .post(`/api/v1/animals/${animalsUsr2[0].id}/vaccination`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/was not provided|is required/);
    });
  });

  describe('PATCH /animals/vaccination/{vaccinationId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        vaccine: 'vaccine-y',
      };
    });

    test('It should return an updated vaccination updating only the vaccine.', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/animals/vaccination/${vaccinationsAnimalUsr1[0].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.vaccination.id).toBe(vaccinationsAnimalUsr1[0].id);
      expect(body.vaccination.vaccine).not.toBe(
        vaccinationsAnimalUsr1[0].vaccine,
      );
      expect(body.vaccination.vaccine).toBe(inputBody.vaccine);
      expect(body.vaccination.description).toBe(
        vaccinationsAnimalUsr1[0].description,
      );
    });

    test('It should return an updated vaccination updating only the description.', async () => {
      delete inputBody.vaccine;
      inputBody.description = 'updated description';

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/vaccination/${vaccinationsAnimalUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.vaccination.id).toBe(vaccinationsAnimalUsr1[1].id);
      expect(body.vaccination.vaccine).toBe(vaccinationsAnimalUsr1[1].vaccine);
      expect(body.vaccination.description).not.toBe(
        vaccinationsAnimalUsr1[1].description,
      );
    });

    test('It should return an error because the data to update was not provided.', async () => {
      delete inputBody.vaccine;

      const { statusCode, body } = await api
        .patch(`/api/v1/animals/vaccination/${vaccinationsAnimalUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/was not provided/);
    });

    test('It should return an error because the vaccination does not belong to the user2 or does not exist.', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/animals/vaccination/${vaccinationsAnimalUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser2}`)
        .send(inputBody);

      expect(statusCode).toBe(404);
      expect(body.message).toMatch(/does not exist|does not belong/);
    });
  });

  describe('DELETE /animals/vaccination/{vaccinationId}', () => {
    test('It should return a 200 statusCode and 1 affectedRows.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/vaccination/${vaccinationsAnimalUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);
      expect(statusCode).toBe(200);
      expect(body.affectedRows).toBe(1);
    });

    test('It should return an error because the animalId does not exist or does not belong to the user2.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/animals/vaccination/${vaccinationsAnimalUsr1[0].id}`)
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(404);
      expect(body.message).toMatch(/does not exist/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
