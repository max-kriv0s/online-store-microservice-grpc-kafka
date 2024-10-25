export type ConfigurationType = {
  appSettings: { serviceName: string; port: number; host: string };
  loggerSettings: { loggerLevel: string; logDir: string };
  databaseSettings: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  kafkaSettings: {
    brokers: string[];
    services: {
      orders: {
        clientId: string;
        groupId: string;
      };
    };
  };
};
export type AppSettingType = ConfigurationType['appSettings'];
export type LoggerSettingType = ConfigurationType['loggerSettings'];
export type DatabaseSettingType = ConfigurationType['databaseSettings'];
export type KafkaSettingsType = ConfigurationType['kafkaSettings'];

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
  databaseSettings: {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  kafkaSettings: {
    brokers: process.env.KAFKA_BROKERS.split(','),
    services: {
      orders: {
        clientId: 'orders-service',
        groupId: 'orders-service-consumer',
      },
    },
  },
});
