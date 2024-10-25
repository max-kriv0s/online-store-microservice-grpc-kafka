import Joi from 'joi';

export const appValidationSchema: Joi.ObjectSchema = Joi.object({
  SERVICE_NAME: Joi.string().required(),
  SERVICE_HOST: Joi.string().required(),
  PORT: Joi.number().port().required(),
  LOG_DIR: Joi.string().required(),
  ACCOUNTS_SERVICE_URL: Joi.string().required(),
  USERS_SERVICE_URL: Joi.string().required(),
  CATEGORIES_SERVICE_URL: Joi.string().required(),
  PRODUCTS_SERVICE_URL: Joi.string().required(),
  PRICES_SERVICE_URL: Joi.string().required(),
});
