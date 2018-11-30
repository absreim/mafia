CREATE TABLE "accounts" (
    "username" text NOT NULL,
    hash text
);

ALTER TABLE ONLY "accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("username");