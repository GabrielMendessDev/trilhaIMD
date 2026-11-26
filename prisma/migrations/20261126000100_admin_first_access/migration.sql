CREATE TABLE "AdminCredential" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "username" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    CONSTRAINT "AdminCredential_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AdminCredential_singleton" CHECK ("id" = 1)
);
