// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import log from "../src/utils/logger";

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

  log("Created user { email: a@a.hr, password: test123 }", __filename);

  const results = [] as any;
  fs.createReadStream("prisma/dataset/renewable_energy.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const collection = await prisma.$transaction(
        results.map((resource: any) =>
          prisma.resource.create({
            data: {
              location: resource['﻿"LOCATION"'],
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

      log(`Created ${collection.length} resources`, __filename);
    });

  log("Seeding complete", __filename);
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
