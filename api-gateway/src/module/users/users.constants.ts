// Users service
export const USERS_CLIENT_NAME = 'USERS_PACKAGE';
export const USERS_PACKAGE = 'users.v1';

export const USER_VALIDATION = {
  username: { length: 150 },
  email: { length: 150 },
  password: { minLength: 6, maxLength: 20 },
};
