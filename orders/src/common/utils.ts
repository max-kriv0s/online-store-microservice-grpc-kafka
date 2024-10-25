import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValueTransformer } from 'typeorm';

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

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}

export class ColumnNumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }
    return null;
  }

  from(data?: string | null): number | null {
    if (!isNullOrUndefined(data)) {
      const res = parseFloat(data);
      if (isNaN(res)) {
        return null;
      } else {
        return res;
      }
    }
    return null;
  }
}

export async function getJsonData<T extends object>(dataRow: string, cls: ClassConstructor<T>): Promise<T> {
  try {
    const data = JSON.parse(dataRow);
    const dto = plainToInstance(cls, data);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }
    return dto;
  } catch (error) {
    throw new Error(error);
  }
}
