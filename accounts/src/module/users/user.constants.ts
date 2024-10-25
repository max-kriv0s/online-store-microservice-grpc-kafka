export const USER_VALIDATION = {
  username: { length: 150 },
  email: { length: 150 },
  password: { minLength: 6, maxLength: 20 },
};

// Errors
export const ERROR_LOGIN_OR_PASSWORD = 'Login or password is not correct';
export const ERROR_REFRESH_TOKEN = 'Incorrect refresh token';
export const ERROR_TOKEN = 'Incorrect token';
export const ERROR_USER_NOT_FOUND = 'User not found';
