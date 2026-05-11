import { getProcoreZone } from '@procore/web-sdk-mfe-utils';
import { environment, init } from './environment';

jest.mock('@procore/web-sdk-mfe-utils', () => ({
  ...jest.requireActual<typeof import('@procore/web-sdk-mfe-utils')>(
    '@procore/web-sdk-mfe-utils'
  ),
  getProcoreZone: jest.fn(),
}));

describe('environment', () => {
  describe('given a production environment', () => {
    describe('when initialized', () => {
      it('creates a dictionary of production environment variables', () => {
        (getProcoreZone as jest.Mock).mockReturnValue({
          environment: 'production',
        });
        const envVars = {
          ENV: 'production',
        };

        init();

        expect(environment).toMatchObject(envVars);
      });
    });
  });
});
