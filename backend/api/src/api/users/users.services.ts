import type { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { db } from "../../db";

export function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUserByEmailAndPassword(user: Prisma.UserCreateInput) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: user,
  });
}

export function findUserById(id: User["id"]) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}
