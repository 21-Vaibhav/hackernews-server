import { prismaClient } from "../../extras/prisma.js";
import {
  GetMeError,
  type GetAllUsersResult,
  type GetMeResult,
} from "./users-types.js";

export const getMe = async (parameters: {
  userId: string;
}): Promise<GetMeResult> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw GetMeError.UNAUTHORIZED;
  }

  return {
    user,
  };
};

export const getAllUsers = async (): Promise<GetAllUsersResult> => {
  const users = await prismaClient.user.findMany();

  return {
    users,
  };
};
