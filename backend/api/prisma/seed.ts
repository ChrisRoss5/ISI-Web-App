// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const kiki = await prisma.user.upsert({
    where: { email: "k1k1@k1k1.dev" },
    update: {},
    create: {
      email: "k1k1@k1k1.dev",
      password: "k1k1",
    },
  });

  console.log({ kiki });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
