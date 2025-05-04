# 🐄 Agroplus-API

**Agroplus-API** is a RESTful API built to help cattle ranchers manage all relevant information about their livestock. It enables users to register, track, and manage data on animals, including parentage, vaccination, deworming records, and personal notes.

## 📌 General Information

- **Project name**: Agroplus-API
- **Target users**: Cattle ranchers or livestock managers.
- **Main purpose**: Maintain a centralized digital history of animals owned by the user, with relevant veterinary records and notes.
- **Status**: ✅ In production
- **Production URL**: [https://agroplus-api.onrender.com/api-docs](https://agroplus-api.onrender.com/api-docs)
- **Development Swagger URL**: `http://localhost:4000/api-docs` *(port may vary depending on your `.env` configuration)*

🎥 **Demo Video**: [Watch how to use the API via Swagger](https://www.loom.com/share/08478aee6b204726a32ff5403c1d3f16?sid=33cafed8-d9e4-4af5-bebb-a6b1490977ce)

---

## 🧑‍💻 Tech Stack

- **Backend**: Node.js + Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT with cookies
- **Docs**: Swagger
- **Containerization**: Docker
- **Architecture**: MVC (based on entities)

### 🔋 Notable Dependencies

- `express` – Web framework
- `sequelize` – ORM for PostgreSQL
- `jsonwebtoken` – JWT-based authentication
- `bcrypt` – Password hashing
- `joi` – Schema validation
- `swagger-ui-express` – API documentation UI
- `@hapi/boom` – Error handling
- `express-rate-limit` – Rate limiter

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

  for production:
  ```bash
  npm run start
  ```
  ---

## 🔐 Authentication

- **System**: JWT access token saved in cookies.  
- **Flow**:  
  1. User registers.  
  2. On login, a unique `accessToken` is issued and saved in a cookie.  
  3. Token has a lifespan of 15 days and is stored in the DB for validation.  
  4. **Security Note**: While not ideal for production-scale security, this implementation ensures simplicity and control via token invalidation by removing it from the DB.  

- **Roles**: No role-based access control; every user has full access to their data.

---

## ⚙️ Core Features

- 🧑 **Register and login a user.**
- 🐄 **CRUD operations for animals**:  
  - Include full animal details.  
  - Define animal parentage (link to mother/father).  
- 💉 **CRUD for vaccinations.**  
- 💊 **CRUD for deworming treatments.**  
- 📝 **CRUD for notes.**

---

## 🧪 API Documentation & Testing

- All endpoints are fully documented using Swagger.  
  - **Production Docs**: [https://agroplus-api.onrender.com/api-docs](https://agroplus-api.onrender.com/api-docs)  
  - **Local Docs**: `http://localhost:4000/api-docs` (ensure correct port in `.env`)  
- Development testing done with Insomnia.

- No testing techniques are implemented. In the future, different testing techniques will be implemented to corroborate the reliability of the API.

---

## 📂 Project Structure

```plaintext
api/
├── index.js
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
```

- **MVC pattern** is followed per module/entity.  
- Each module contains all necessary logic (schema, controller, service, repo, route).

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

---

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

## 🚫 Limitations & Future Work

- No role-based authorization.  
- Not optimized for multi-user collaboration or large-scale usage.  
- No frontend – interaction is via Swagger.  
- 🔜 **Planned**: Add automated testing (unit/integration tests).

---

## 👤 Author & License

- **Author**: Oscar Santiago Monsalve  
- **GitHub**: [OscarS05](https://github.com/OscarS05)  
- **License**: Creative Commons BY-NC 4.0  

---

## ✅ Final Notes

**Agroplus-API** is a personal backend project built with clean structure and simplicity in mind. It is production-ready for small-scale use, especially for individual ranchers or developers interested in API architectures using Node.js, Sequelize, and JWT.
