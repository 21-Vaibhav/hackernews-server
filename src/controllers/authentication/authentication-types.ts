import type { User } from '@prisma/client';

export type SignUpWithUsernameAndPasswordResult = {
    token: string;
    user: User;
};

export type signInWithUsernameAndPasswordResult = {
    token: string;
    user: User;
};

export enum signUpWithUsernameAndPasswordError {
    CONFLICTING_USERNAME = 'CONFLICTING_USERNAME',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
export enum signInWithUsernameAndPasswordError {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}