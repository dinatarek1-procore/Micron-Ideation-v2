import {
  SystemEvents,
  SystemEventNames,
  type LogMessage,
} from '@procore/web-sdk-events';

export const navigationEventType = 'application:navigation';
export const loggingEventType = 'application:logging';
/** Keep in sync with `app.config.ts` `toolName`. */
export const serviceName = 'prototypeApp';

export const systemEvents = new SystemEvents(serviceName);

export function dispatchSystemNavigationEvent(url: string) {
  systemEvents.publish(SystemEventNames.NAVIGATION_TRANSITION, {
    url,
  });
}

export function mfeLogger(logMessage: LogMessage) {
  const companyIdPattern = /\/companies\/(\d+)/;
  const projectIdPattern = /\/projects\/(\d+)/;

  const companyIdMatch = companyIdPattern.exec(window.location.pathname);
  const companyid = companyIdMatch?.[1];

  const projectIdMatch = projectIdPattern.exec(window.location.pathname);
  const projectid = projectIdMatch?.[1];

  const metaDataParams = {
    ...(companyid && { companyid }),
    ...(projectid && { projectid }),
  };

  systemEvents.publish(
    SystemEventNames.UTILITIES_LOG,
    {
      ...logMessage,
      url: window.location.href,
    },
    metaDataParams
  );
}
