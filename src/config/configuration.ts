export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  node_env: process.env.NODE_ENV || 'development',
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_DATABASE || 'clinic_pet',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '5h',
  },
  smtp: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  cors: {
    origin: true,
    credentials: true,
  },
});
