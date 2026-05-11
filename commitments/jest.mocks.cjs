/**
 * Jest runs @procore/json-toolinator CJS with esbuild __toESM(require("styled-components"), 1).
 * When `require("styled-components")` returns a namespace object with __esModule, `.default`
 * becomes the whole namespace (not callable). Re-export the default callable as the module root.
 */
jest.mock('styled-components', () => {
  const actual = jest.requireActual('styled-components');
  const styled = actual.default;
  return Object.assign(styled, actual, { default: styled });
});

/**
 * Real @procore/engagement-emails pulls @procore/data-table → react-resize-detector (ESM),
 * which Jest does not transform by default. Stub the package so app.config and integration
 * tests can load without that chain.
 */
jest.mock('@procore/engagement-emails', () => {
  const React = require('react');
  const Emails = (props) =>
    React.createElement('div', {
      'data-testid': 'engagement-emails',
      ...props,
    });
  Emails.Provider = ({ children }) =>
    React.createElement(
      'div',
      { 'data-testid': 'engagement-emails-provider' },
      children
    );
  return { __esModule: true, Emails };
});

/** Avoid loading @procore/text-editor → ckeditor5 in Jest (CreateFormTearsheetView). */
jest.mock('@procore/json-formulator-extensions', () => {
  const React = require('react');
  return {
    __esModule: true,
    ConnectedFileSelectWidget: () =>
      React.createElement('div', {
        'data-testid': 'connected-file-select-stub',
      }),
  };
});
