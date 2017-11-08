DROP DATABASE IF EXISTS matcha;
CREATE DATABASE matcha;

\c matcha;

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
	"login" VARCHAR NOT NULL UNIQUE,
	"name" VARCHAR NOT NULL,
	"first_name" VARCHAR NOT NULL,
	"birth" DATE NOT NULL,
	"sex" VARCHAR,
	"sex_pref" VARCHAR NOT NULL DEFAULT 'B',
	"mail" VARCHAR NOT NULL UNIQUE,
	"passwd" VARCHAR NOT NULL,
	"bio" VARCHAR,
	"latitude" DECIMAL NOT NULL,
	"longitude" DECIMAL NOT NULL,
	"ip" VARCHAR NOT NULL,
	"active" BOOLEAN DEFAULT TRUE,
	"last_log" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "images" (
	"user_id" INT NOT NULL,
	"path" VARCHAR NOT NULL,
	"main" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "user_tags" (
	"user_id" INT NOT NULL,
	"tags" VARCHAR NOT NULL
);

CREATE TABLE "tags" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR NOT NULL UNIQUE
);

CREATE TABLE "likes" (
	"user_id" INT NOT NULL,
	"like_for" INT NOT NULL
);

CREATE TABLE "users_block" (
	"user_id" INT NOT NULL,
	"block_for" INT NOT NULL
);