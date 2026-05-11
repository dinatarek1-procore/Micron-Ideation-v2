export type ClientEnvironment = {
  ENV: AppEnv;
  BUGSNAG_API_KEY: string | undefined;
  GOOGLE_MAPS_API_KEY: string | undefined;
};

export type AppEnv = 'development' | 'staging' | 'production';
type EnvironmentConfig = {
  default: Readonly<Omit<ClientEnvironment, 'ENV'>>;
} & {
  [key in AppEnv]: Readonly<Partial<ClientEnvironment>>;
};

export const clientEnvironment: EnvironmentConfig = {
  default: {
    BUGSNAG_API_KEY: process.env.PROCORE_HYDRA_BUGSNAG_API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.PROCORE_HYDRA_GOOGLE_MAPS_API_KEY,
  },
  development: {
    ENV: 'development',
  },
  staging: {
    ENV: 'staging',
  },
  production: {
    ENV: 'production',
  },
};
