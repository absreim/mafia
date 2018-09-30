CREATE TABLE "accounts" (
    "username" text NOT NULL,
    hash text
);

ALTER TABLE ONLY "accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("username");

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;