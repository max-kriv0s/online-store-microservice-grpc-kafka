import { ValidationError } from 'class-validator';

export type ErrorOfResponseType = { key: string; message: string };

export function getErrorOfResponse(errors: ValidationError[]): ErrorOfResponseType[] {
  const errorOfResponse = errors.flatMap((error) => {
    const constraints = error.constraints ?? {};
    return Object.values(constraints).map((value) => ({
      key: error.property,
      message: value,
    }));
  });
  return errorOfResponse;
}
