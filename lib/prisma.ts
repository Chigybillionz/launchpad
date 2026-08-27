// In this specific environment (Prisma 8.0.0-rc.12 with Prisma Composer), 
// standard "prisma generate" is not available for @prisma/client, so we typecast PrismaClient.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = any;

declare global {
  var prisma: PrismaClientType | undefined;
}

function getPrismaClient() {
  try {
    const { PrismaClient } = require("@prisma/client");
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  } catch (error) {
    console.warn("Prisma client could not be loaded. This is expected if the client hasn't been generated yet.");
    // Return a dummy object for build time
    return {
      $queryRaw: async () => [],
    } as PrismaClientType;
  }
}

export const prisma = global.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
