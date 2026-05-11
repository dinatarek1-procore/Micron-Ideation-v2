export const metadataEndpoint = '/rest/v1.1/environment_metadata';

interface MeResponse {
  id: number;
  login: string;
  name: string;
}

const developerObject: MeResponse = {
  id: 1,
  login: 'user@procore.com',
  name: 'Procore Developer',
};

interface AgentData {
  chatUrl: string;
  contact?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  deployment_id: string;
  support_url: string;
  online_id: string;
  offline_id: string;
}

interface Metadata extends Record<string, unknown> {
  user: {
    id: number;
    login: string;
    name: string;
  };
  i18n: {
    locale: string;
  };
  vendors: {
    bugsnag: {
      apiKey: string;
    };
    googleAnalytics: {
      ua: string;
    };
    launchDarkly: {
      appId: string;
    };
    newRelic: {
      accountID: string;
      licenseKey: string;
      applicationID: string;
    };
    mindTouch: {
      embedCodes: {
        [k: string]: {
          src: string;
          id: string;
        };
      };
    };
    pendo: {
      apiKey: string;
      visitor: object;
      account: object;
    };
    pusher: {
      apiKey: string;
    };
    serviceCloud: {
      agentData: AgentData;
      deploymentId: string;
      orgId: string;
    };
    userVoice: {
      ssoKey: string;
    };
  };
}

export function getEnvMetadata(user?: MeResponse): Metadata {
  return {
    user: user ?? developerObject,
    i18n: {
      locale: 'en',
    },
    vendors: {
      launchDarkly: {
        appId: 'mock-app-id',
      },
      bugsnag: {
        apiKey: process.env.PROCORE_HYDRA_BUGSNAG_API_KEY ?? '',
      },
      googleAnalytics: {
        ua: 'mock-ua',
      },
      mindTouch: {
        embedCodes: {
          en: {
            src: 'https://support.procore.com/@embed/aef0b0c37393b9eeb23fd97982c8bf4ad4d6e1869f1452cf654e1b9972acace7.js',
            id: 'mindtouch-embed-aef0b0c37393b9eeb23fd97982c8bf4ad4d6e1869f1452cf654e1b9972acace7',
          },
          'en-CA': {
            src: 'https://en-ca.support.procore.com/@embed/9c52592c0c20177d970a3903e2bde5b1e14f749af8318c3f13541e8b54df0c5c.js',
            id: 'mindtouch-embed-9c52592c0c20177d970a3903e2bde5b1e14f749af8318c3f13541e8b54df0c5c',
          },
          'en-GB': {
            src: 'https://en-gb.support.procore.com/@embed/2c60938c7ceef5758c1fbc39b314350f6e28579590fdb2fde7b743822eaae3d9.js',
            id: 'mindtouch-embed-2c60938c7ceef5758c1fbc39b314350f6e28579590fdb2fde7b743822eaae3d9',
          },
          'en-AU': {
            src: 'https://en-au.support.procore.com/@embed/8fe041617c9c31b2ebfa6a37514900d94a78cce89429c5b655c2f699d7cef00d.js',
            id: 'mindtouch-embed-8fe041617c9c31b2ebfa6a37514900d94a78cce89429c5b655c2f699d7cef00d',
          },
          es: {
            src: 'https://es.support.procore.com/@embed/b220adad92350b5e713c113facb2be53b9f3f256ebc781e0e903feacc066259f.js',
            id: 'mindtouch-embed-b220adad92350b5e713c113facb2be53b9f3f256ebc781e0e903feacc066259f',
          },
          'fr-CA': {
            src: 'https://fr-ca.support.procore.com/@embed/0b5781df64a3809d2e24eba7ea4fa5351c8ad69b720858f52fff12eb629daab8.js',
            id: 'mindtouch-embed-0b5781df64a3809d2e24eba7ea4fa5351c8ad69b720858f52fff12eb629daab8',
          },
        },
      },
      newRelic: {
        accountID: 'mock-account-id',
        applicationID: 'mock-application-id',
        licenseKey: 'mock-license-key',
      },
      pendo: {
        apiKey: 'mock-api-key',
        visitor: {
          createdAt: '2015-11-03T17:42:51Z',
          email: 'faris.mustafa@procore.com',
          id: 1010929,
          isCompanyAdmin: true,
          jobTitle: '',
          locale: 'en',
          name: ' ',
          tools: [
            'dashboard',
            'dashboard',
            'dashboard',
            'dashboard',
            'programs',
            'home',
            'prototype',
            'timecard',
            'calendar',
            'directory',
            'reports',
            'documents',
            'checklists',
            'generic_tool_2979',
            'generic_tool_3384',
            'generic_tool_5990',
            'workflows',
            'generic_tool_14421',
            'managed_equipment',
            'app_management',
            'timesheets',
            'generic_tool_69038',
            'permissions',
            'generic_tool_105669',
            'admin',
          ],
          team: null,
          role: null,
          is_collaborator: null,
        },
        account: {
          createdAt: '2011-12-02T18:11:24Z',
          salesforceAccountId: null,
          id: 2675,
          isDemo: true,
          isTrial: false,
          name: 'Twenty Twelve (Jana)',
          locale: 'en',
          timeZone: 'Pacific Time (US \u0026 Canada)',
          erpIntegrationId: null,
          erpIntegrationServiceUrl: null,
        },
      },
      pusher: {
        apiKey: 'mock-api-key',
      },
      serviceCloud: {
        agentData: {
          chatUrl: 'https://d.la4-c2-chi.salesforceliveagent.com/chat',
          contact: {
            first_name: 'Developer',
            last_name: 'Procore',
            email: 'user@procore.com',
          },
          deployment_id: '',
          support_url: 'https://support.procore.com/references/report-an-issue',
          online_id: '',
          offline_id: '',
        },
        deploymentId: '',
        orgId: '',
      },
      userVoice: {
        ssoKey: 'mock-sso-key',
      },
    },
  };
}
