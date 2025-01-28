export function resolveEnvFiles(): string | string[] {
  if (process.env.NODE_ENV === 'test') {
    return '.env.test.local';
  } else {
    return '.env';
  }
}
