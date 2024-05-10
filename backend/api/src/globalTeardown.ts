import { db } from "./db";
import { globalUserCredentials } from "./globalSetup";

const teardown = async () => {
  await db.resource.deleteMany();

  await db.user.delete({
    where: {
      id: globalUserCredentials.id,
    },
  });
  console.log("---------TESTS FINISHED--------");
};

export default teardown;
