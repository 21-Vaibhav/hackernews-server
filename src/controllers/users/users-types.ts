import type { User } from '@prisma/client';

export type GetMeResult = {
    user: User;
};

export enum GetMeError {
    UNAUTHORIZED = 'UNAUTHORIZED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export type GetAllUsersResult = {
    users: User[];
};