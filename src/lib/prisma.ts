import { PrismaClient } from "@prisma/client";

console.log("DATABASE_URL =", process.env.DATABASE_URL);
console.log("DIRECT_URL =", process.env.DIRECT_URL);

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
  });
};

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}