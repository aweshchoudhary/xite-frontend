import { prisma, Prisma } from "./prisma/connection";
export * from "./prisma/generated/prisma";

export { prisma as primaryDB, type Prisma as PrimaryDB };
