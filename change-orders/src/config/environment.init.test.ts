import { getProcoreZone } from '@procore/web-sdk-mfe-utils';
import { environment, init } from './environment';

jest.mock('@procore/web-sdk-mfe-utils', () => ({
  ...jest.requireActual<typeof import('@procore/web-sdk-mfe-utils')>(
    '@procore/web-sdk-mfe-utils'
  ),
  getProcoreZone: jest.fn(),
}));

describe('environment.init (jsdom)', () => {
  it('populates ENV and development after init()', () => {
    (getProcoreZone as jest.Mock).mockReturnValue({
      environment: 'development',
    });

    init();

    expect(['development', 'staging', 'production']).toContain(
      environment.ENV as string
    );
    expect(environment.development).toBe(environment.ENV === 'development');
  });
});
