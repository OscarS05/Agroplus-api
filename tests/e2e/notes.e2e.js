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
  let notesUsr1 = null;
  let notesUsr2 = null;

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

    // auth user2
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

    // db data
    const [notes1, notes2] = await Promise.all([
      models.Note.findAll({ where: { userId: user1.id } }),
      models.Note.findAll({ where: { userId: user2.id } }),
    ]);

    notesUsr1 = notes1;
    notesUsr2 = notes2;
  });

  describe('GET /notes', () => {
    test('It should return a list of notes from user1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/notes')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.notes).toHaveLength(2);
      expect(body.notes[0].id).toEqual(notesUsr1[0].id);
      expect(body.notes[0].user.id).toEqual(notesUsr1[0].userId);
    });

    test('It should return a list of notes from user2.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/notes')
        .set('Cookie', `accessToken=${accessTokenUser2}`);

      expect(statusCode).toBe(200);
      expect(body.notes).toHaveLength(2);
      expect(body.notes[0].id).toEqual(notesUsr2[0].id);
      expect(body.notes[0].user.id).toEqual(notesUsr2[0].userId);
    });

    test('It should return an error because the query is not allowed.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/notes?sex=Female')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return an empty array because the title does not exist.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/notes?title=title-x')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.notes).toHaveLength(0);
    });

    test('It should return an array with 1 notes because the match is only 1.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/notes?title=2')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.notes).toHaveLength(1);
      expect(body.notes[0].name).toEqual(notesUsr1[1].name);
    });

    test('It should return an array with 2 notes because the match is only 2.', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/notes?title=task')
        .set('Cookie', `accessToken=${accessTokenUser1}`);

      expect(statusCode).toBe(200);
      expect(body.notes).toHaveLength(2);
      expect(body.notes[0].name).toEqual(notesUsr1[1].name);
    });
  });

  describe('POST /users/{userId}/notes', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        title: 'task 100',
      };
    });

    test('It should return a new notes without description.', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/notes`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.note.title).toBe(inputBody.title);
      expect(body.note.description).toBe(null);
      expect(body.note.user.id).toBe(user1.id);
      expect(body.note.user.code).toBe(user1.code);
    });

    test('It should return a new notes with description.', async () => {
      inputBody.description = 'The description is x';

      const { statusCode, body } = await api
        .post(`/api/v1/notes`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(201);
      expect(body.note.title).toBe(inputBody.title);
      expect(body.note.description).toBe(inputBody.description);
      expect(body.note.user.id).toBe(user1.id);
      expect(body.note.user.code).toBe(user1.code);
    });

    test('It should return an error because the data is invalid.', async () => {
      inputBody.register = new Date();

      const { statusCode, body } = await api
        .post(`/api/v1/notes`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/is not allowed/);
    });

    test('It should return an error because the data is invalid.', async () => {
      delete inputBody.title;

      const { statusCode, body } = await api
        .post(`/api/v1/notes`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/was not provided|is required/);
    });
  });

  describe('PATCH /notes/{noteId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        title: 'title-y',
      };
    });

    test('It should return an updated notes updating only the title.', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/notes/${notesUsr1[0].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.note.id).toBe(notesUsr1[0].id);
      expect(body.note.title).not.toBe(notesUsr1[0].title);
      expect(body.note.title).toBe(inputBody.title);
      expect(body.note.description).toBe(notesUsr1[0].description);
    });

    test('It should return an updated notes updating only the description.', async () => {
      delete inputBody.title;
      inputBody.description = 'updated description';

      const { statusCode, body } = await api
        .patch(`/api/v1/notes/${notesUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(200);
      expect(body.note.id).toBe(notesUsr1[1].id);
      expect(body.note.title).toBe(notesUsr1[1].title);
      expect(body.note.description).not.toBe(notesUsr1[1].description);
    });

    test('It should return an error because the data to update was not provided.', async () => {
      delete inputBody.title;

      const { statusCode, body } = await api
        .patch(`/api/v1/notes/${notesUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`)
        .send(inputBody);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/was not provided/);
    });

    test('It should return an error because the notes does not belong to the user2 or does not exist.', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/notes/${notesUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser2}`)
        .send(inputBody);

      expect(statusCode).toBe(404);
      expect(body.message).toMatch(/does not exist|does not belong/);
    });
  });

  describe('DELETE /notes/{notesId}', () => {
    test('It should return a 200 statusCode and 1 affectedRows.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/notes/${notesUsr1[1].id}`)
        .set('Cookie', `accessToken=${accessTokenUser1}`);
      expect(statusCode).toBe(200);
      expect(body.affectedRows).toBe(1);
    });

    test('It should return an error because the userId does not exist or does not belong to the user2.', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/notes/${notesUsr1[0].id}`)
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
