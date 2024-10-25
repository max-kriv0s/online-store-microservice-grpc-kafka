export type ConfigurationType = {
  appSettings: { serviceName: string; port: number; host: string };
  loggerSettings: { loggerLevel: string; logDir: string };
  authServiceSettings: { url: string };
  usersServiceSettings: { url: string };
  categoriesServiceSettings: { url: string };
  productsServiceSettings: { url: string };
  pricesServiceSettings: { url: string };
};
export type AppSettingType = ConfigurationType['appSettings'];
export type LoggerSettingType = ConfigurationType['loggerSettings'];
export type AuthServiceSettings = ConfigurationType['authServiceSettings'];
export type UsersServiceSettings = ConfigurationType['usersServiceSettings'];
export type CategoriesServiceSettings = ConfigurationType['categoriesServiceSettings'];
export type ProductsServiceSettings = ConfigurationType['productsServiceSettings'];
export type PricesServiceSettings = ConfigurationType['pricesServiceSettings'];

export default (): ConfigurationType => ({
  appSettings: {
    port: Number.parseInt(process.env.PORT),
    serviceName: process.env.SERVICE_NAME,
    host: process.env.SERVICE_HOST,
  },
  loggerSettings: {
    loggerLevel: process.env.LOGGER_LEVEL || 'info',
    logDir: process.env.LOG_DIR,
  },
  authServiceSettings: {
    url: process.env.ACCOUNTS_SERVICE_URL,
  },
  usersServiceSettings: {
    url: process.env.USERS_SERVICE_URL,
  },
  categoriesServiceSettings: { url: process.env.CATEGORIES_SERVICE_URL },
  productsServiceSettings: { url: process.env.PRODUCTS_SERVICE_URL },
  pricesServiceSettings: { url: process.env.PRICES_SERVICE_URL },
});
