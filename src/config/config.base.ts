export const configBase = {
  CLOUD_NAME: 'jwdev',
  IS_GCP: process.env.IS_GCP === '1',
  EMAIL_ADDRESS: 'mr-stats@outlook.com',
  PORT: process.env.PORT || '4040'
} as const
