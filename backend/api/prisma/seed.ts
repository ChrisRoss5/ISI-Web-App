// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "a@a.hr" },
    update: {},
    create: {
      email: "a@a.hr",
      password: "$2b$12$oMXl6Rkkr5ft7yOWdDlZNewQJJ.RdFGZfePZwIjdZHAv7LEYOaWe6",
    },
  });

  console.log("Created user: ", user);
  console.log("User password: test123");


  const results = [] as any;
  fs.createReadStream("../dataset/renewable_energy.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {

      const collection = await prisma.$transaction(
        results.map((resource: any) =>
          prisma.resource.create({
            data: {
              location: resource['"LOCATION"'],
              indicator: resource.INDICATOR,
              subject: resource.SUBJECT,
              measure: resource.MEASURE,
              frequency: resource.FREQUENCY,
              time: resource.TIME,
              value: parseFloat(resource.Value || "0"),
              ...(resource["Flag Codes"]
                ? { flagCodes: resource["Flag Codes"] }
                : {}),
              userId: user.id,
            },
          })
        )
      );

      console.log(`Created ${collection.length} resources`);
    });
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
