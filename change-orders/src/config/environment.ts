import { getProcoreZone } from '@procore/web-sdk-mfe-utils';
import {
  clientEnvironment,
  type AppEnv,
  type ClientEnvironment,
} from './clientEnvironment';

export type Environment = {
  [K in AppEnv]?: boolean;
} & Partial<ClientEnvironment>;

export const environment: Environment = {};

function envHasKey(obj: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function fetchEnvironment() {
  const currentDomain = window.location.hostname;
  const { environment } = getProcoreZone(currentDomain);
  return {
    ...clientEnvironment.default,
    ...clientEnvironment[environment],
  };
}

export function init() {
  const env = fetchEnvironment();

  Object.keys(env).forEach((key) => {
    if (!envHasKey(environment, key)) {
      Object.defineProperty(environment, key, {
        enumerable: true,
        get() {
          return env[key as keyof typeof env];
        },
      });
    }
  });

  if (!envHasKey(environment, 'ENV')) {
    Object.defineProperty(environment, 'ENV', {
      enumerable: true,
      get() {
        return 'development';
      },
    });
  }

  if (!envHasKey(environment, 'development')) {
    Object.defineProperty(environment, 'development', {
      enumerable: true,
      get() {
        return environment.ENV === 'development';
      },
    });
  }

  if (!envHasKey(environment, 'staging')) {
    Object.defineProperty(environment, 'staging', {
      enumerable: true,
      get() {
        return environment.ENV === 'staging';
      },
    });
  }

  if (!envHasKey(environment, 'production')) {
    Object.defineProperty(environment, 'production', {
      enumerable: true,
      get() {
        return environment.ENV === 'production';
      },
    });
  }
}
