import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

declare global {
  var prismaClient: PrismaClient | undefined;
}

const createClient = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
};

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = createClient();
} else {
  if (!global.prismaClient) {
    global.prismaClient = createClient();
  }
  prismaClient = global.prismaClient;
}

export default prismaClient;
