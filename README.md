# 🐄 Agroplus-API

**Agroplus-API** is a RESTful API built to help cattle ranchers manage all relevant information about their livestock. It enables users to register, track, and manage data on animals, including parentage, vaccination, deworming records, and personal notes.

---

<p align="left"> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="40" height="40"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg" alt="Sequelize" width="40" height="40"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width="40" height="40"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" width="40" height="40"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" alt="Jest" width="40" height="40" />
</p>

---

## 🧑‍💻 Tech Stack

- **Backend**: Node.js + Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Container**: Docker
- **Authentication**: JWT with cookies
- **Docs**: Swagger
- **Containerization**: Docker
- **Architecture**: MVC (based on entities)
- **Testing**: Jest + Supertest

---

## ⚙️ Features

- 🧑 **Register and login a user**
- 🐄 **CRUD operations for animals**:
  - Include full animal details.
  - Define animal parentage (link to mother/father).
- 💉 **CRUD for vaccinations.**
- 💊 **CRUD for deworming treatments.**
- 📝 **CRUD for notes.**

## 🙈 **Planned**

- 🔜 : Compatible with **GraphQL**.

---

## 🔐 Authentication

- **System**: JWT access token saved in cookies.
- **Flow**:

  1. User registers.
  2. On login, a unique `accessToken` is issued and saved in a cookie.
  3. Token has a lifespan of 60 minutes and is stored in the DB for validation.
  4. **Security Note**: This implementation ensures simplicity and control via token invalidation by removing it from the DB.

- **Roles**: No role-based access control; every user has full access to their data.

## Testing

The project has been tested in a robust way using **Jest + Supertest**. The implemented tests were **unit tests and E2E tests**.

---

## 📂 Project Structure

```plaintext
api/
├── index.js
├── app.js
├── config/
├── src/
│   ├── middlewares/
│   ├── utils/
│   │   └── docs/
│   │       └── swagger.js
│   ├── store/
│   │   └── (DB setup, Sequelize initialization)
│   ├── modules/
│       ├── animal/
│       │   ├── animal.controller.js
│       │   ├── animal.routes.js
│       │   ├── animal.schema.js
│       │   ├── animal.service.js
│       │   └── animal.repository.js
│       ├── user/
│       ├── deworming/
│       ├── vaccination/
│       ├── note/
│       └── routes.js (main router)

/tests/
├── unit/
│   └── [ServiceName].test.js   # Ej: user-service.test.js
│
├── e2e/
│   └── [Entidad].e2e.js            # Ej: vaccination.e2e.js — all vaccination endpoints
```

- **MVC pattern** is followed per module/entity.
- Each module contains all necessary logic (schema, controller, service, repo, route).

---

## 🛠️ Installation & Setup

### ✅ Requirements

- Docker Desktop
- Node.js (v18+ recommended)
- NPM

### ⚙️ Steps to Run Locally

1. **Clone the repo**

   ```bash
   git clone git@github.com:OscarS05/Agroplus-api.git
   cd agroplus-api

   ```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**  
   Copy the `.env.example` file to `.env` and update it with database values. Use the `docker-compose.yml` file to get the DB credentials.

```bash
cp .env.example .env
```

4. **Run Docker containers (for DB)**

```bash
docker-compose up -d
```

5. **Run migrations to set up DB schema**

```bash
npm run migrations:run
```

6. **Start the server**  
   for development:

```bash
npm run dev
```

---

## 📥 Example Requests & Responses

Here are example requests and responses for some endpoints:

### 🔸 POST `/animals/`

**Description**: Creates a new animal record in the database.

**Request Body** _(example)_:

```bash
{
  "livestockType": "Bovino",
  "animalType": "Vaca",
  "breed": "Angus",
  "code": "BOV-001",
  "sex": "Female",
  "father": "d0759f76-a119-4be0-ad33-e93595f56be8"
}
```

**Response** _(example)_:

```bash
{
  "message": "Animal was successfully created",
  "success": true,
  "newAnimal": {
    "id": "c36b4f45-35f9-4d77-9669-e55eb7d33405",
    "livestockType": "Bovino",
    "animalType": "Vaca",
    "breed": "Angus",
    "code": "BOV-001",
    "sex": "Female",
    "mother": null,
    "father": "OPP-TT1",
    "birthDate": null,
    "registeredAt": "2025-04-16"
  }
}
```

### 🔸 GET `/animals/vaccination/`

**Description**: Retrieves the list of all vaccinations associated with animals.

**Response** _(example)_:

```bash
{
  "vaccinations": [
    {
      "id": "065f441b-64ba-411a-97d1-7cbf15443732",
      "vaccine": "Ivermectin 0.5%",
      "description": "Updated",
      "animal": "abc-123",
      "registeredAt": "2025-04-16"
    }
  ],
  "success": true
}
```

---

## 🧪 API Documentation

- All endpoints are fully documented using Swagger. Be sure to have the right server when trying on Swagger.
  - **Production Docs**: [https://agroplus-api.onrender.com/api-docs](https://agroplus-api.onrender.com/api-docs)
  - **Local Docs**: `http://localhost:4000/api-docs` (ensure correct port in `.env`)
    **Note**: Production docs are not currently available

## 📌 Information to test the API

- **Development Swagger URL**: `http://localhost:4000/api-docs` _(port may vary depending on your `.env` configuration)_

🎥 **Demo Video**: [Watch how to use the API via Swagger](https://www.loom.com/share/08478aee6b204726a32ff5403c1d3f16?sid=33cafed8-d9e4-4af5-bebb-a6b1490977ce)

---

## 👤 Author & License

- **Author**: Oscar Santiago Monsalve
- **GitHub**: [OscarS05](https://github.com/OscarS05)
- **License**: Creative Commons BY-NC 4.0
