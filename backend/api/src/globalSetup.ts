import * as bcrypt from "bcrypt";
import { db } from "./db";
import { generateAccessToken } from "./utils/jwt";

export const globalUserCredentials = {
  id: "cl9fpgbug00032e6djr6s4ydf",
  email: "k1k1@test.com",
  password: "Test1@123",
};

export const resources = [
  { content: "Resource1", favourite: false },
  { content: "Resource2", favourite: true },
  { content: "Resource3", favourite: false },
];

const setup = async () => {
  console.log("---------TESTS STARTED--------");

  // user setup
  const user = await db.user.create({
    data: {
      id: globalUserCredentials.id,
      password: bcrypt.hashSync(globalUserCredentials.password, 12),
      email: globalUserCredentials.email,
    },
  });
  const validToken = generateAccessToken({ userId: user.id }, "15m");
  process.env.VALID_ACCESS_TOKEN_FOR_TESTING = validToken;

  // resources setup
  for (const resource of resources) {
    await db.resource.create({
      // data: { ...resource, user: { connect: { id: user.id } } },
      data: { ...resource, userId: user.id },
    });
  }
};

export default setup;
