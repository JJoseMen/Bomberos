export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/sippci?schema=public',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'CHANGE_ME_SUPER_SECRET_KEY',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  email: {
    host: process.env.SMTP_HOST ?? '',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
  },
  kerberos: {
    mockMode: process.env.KERBEROS_MOCK_MODE === 'true',
    url: process.env.KERBEROS_URL ?? '',
  },
});