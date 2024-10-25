import Joi from 'joi';

export const appValidationSchema: Joi.ObjectSchema = Joi.object({
  SERVICE_NAME: Joi.string().required(),
  SERVICE_HOST: Joi.string().required(),
  PORT: Joi.number().port().required(),
  LOG_DIR: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  KAFKA_BROKERS: Joi.string().required(),
});
