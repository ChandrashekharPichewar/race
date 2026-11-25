export type TestEnvName = 'local' | 'staging' | 'prod';

export interface EnvConfig {
  name: TestEnvName;
  baseUrl: string;
  apiBaseUrl: string;
  runLiveApi: boolean;
  defaultTimeoutMs: number;
}

const ENV_MAP: Record<TestEnvName, Omit<EnvConfig, 'runLiveApi' | 'defaultTimeoutMs'>> = {
  local: {
    name: 'local',
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    apiBaseUrl:
      process.env.API_BASE_URL || 'https://my-app-backend-4lw0.onrender.com/api',
  },
  staging: {
    name: 'staging',
    baseUrl: process.env.BASE_URL || 'https://race-staging.vercel.app',
    apiBaseUrl:
      process.env.API_BASE_URL || 'https://my-app-backend-4lw0.onrender.com/api',
  },
  prod: {
    name: 'prod',
    baseUrl: process.env.BASE_URL || 'https://race-cyan.vercel.app',
    apiBaseUrl:
      process.env.API_BASE_URL || 'https://my-app-backend-4lw0.onrender.com/api',
  },
};

const rawEnv = (process.env.TEST_ENV || 'local').toLowerCase() as TestEnvName;
const selected = ENV_MAP[rawEnv] ?? ENV_MAP.local;

export const envConfig: EnvConfig = {
  ...selected,
  baseUrl: (process.env.BASE_URL || selected.baseUrl).replace(/\/+$/, ''),
  runLiveApi: process.env.RUN_LIVE_API === 'true',
  defaultTimeoutMs: Number(
    process.env.TEST_TIMEOUT_MS || (process.env.CI ? 45_000 : 30_000)
  ),
};
