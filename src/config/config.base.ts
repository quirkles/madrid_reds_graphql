export interface Config {
    CLOUD_NAME: string;
    EMAIL_ADDRESS: string;
    PORT: string;
    IS_GCP: boolean;
    VERIFY_EMAIL_URL: string;
    FRONTEND_URL: string;
}

export const configBase: Pick<Config,
    | 'CLOUD_NAME'
    | 'IS_GCP'
    | 'EMAIL_ADDRESS'
    | 'PORT'> = {
      CLOUD_NAME: 'jwdev',
      IS_GCP: process.env.IS_GCP === '1',
      EMAIL_ADDRESS: 'mr-stats@outlook.com',
      PORT: process.env.PORT || '4040'
    } as const
