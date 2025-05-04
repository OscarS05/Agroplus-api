CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NULL,
    "email" VARCHAR(255) NULL,
    "password" VARCHAR(255) NULL,
    "role" VARCHAR(255) NULL DEFAULT 'Basic',
    "token" VARCHAR(255) NOT NULL,
    "created_at" DATE NULL DEFAULT 'Now'
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "animals"(
    "id" UUID NOT NULL,
    "livestock_type" VARCHAR(255) NULL,
    "animal_type" VARCHAR(255) NULL,
    "code" VARCHAR(255) NULL,
    "breed" VARCHAR(255) NULL,
    "sex" VARCHAR(255) NULL,
    "mother_id" UUID NOT NULL,
    "father_id" UUID NOT NULL,
    "user_id" UUID NULL,
    "registered_at" DATE NULL DEFAULT 'Now',
    "birth_date" DATE NOT NULL
);
ALTER TABLE
    "animals" ADD PRIMARY KEY("id");
CREATE TABLE "deworming"(
    "id" UUID NOT NULL,
    "dewormer" VARCHAR(255) NULL,
    "description" TEXT NOT NULL,
    "animal_id" UUID NULL,
    "registered_at" DATE NULL DEFAULT 'Now'
);
ALTER TABLE
    "deworming" ADD PRIMARY KEY("id");
CREATE TABLE "vaccination"(
    "id" UUID NOT NULL,
    "vaccine" VARCHAR(255) NULL,
    "description" TEXT NOT NULL,
    "animal_id" UUID NULL,
    "registered_at" DATE NULL DEFAULT 'Now'
);
ALTER TABLE
    "vaccination" ADD PRIMARY KEY("id");
CREATE TABLE "notes"(
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NULL,
    "description" TEXT NOT NULL,
    "user_id" UUID NULL,
    "created_at" DATE NULL DEFAULT 'Now'
);
ALTER TABLE
    "notes" ADD PRIMARY KEY("id");
ALTER TABLE
    "notes" ADD CONSTRAINT "notes_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "animals" ADD CONSTRAINT "animals_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "vaccination" ADD CONSTRAINT "vaccination_animal_id_foreign" FOREIGN KEY("animal_id") REFERENCES "animals"("id");
ALTER TABLE
    "deworming" ADD CONSTRAINT "deworming_animal_id_foreign" FOREIGN KEY("animal_id") REFERENCES "animals"("id");