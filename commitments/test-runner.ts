import type { TestRunnerConfig } from '@storybook/test-runner';
import type { ConsoleMessage } from '@playwright/test';

const collected: { console: string[]; page: string[] } = {
  console: [],
  page: [],
};

function onConsole(msg: ConsoleMessage) {
  if (msg.type() === 'error') {
    collected.console.push(msg.text());
  }
}

function onPageError(error: Error) {
  collected.page.push(String(error));
}

const config: TestRunnerConfig = {
  async preVisit(page) {
    collected.console = [];
    collected.page = [];
    page.on('console', onConsole);
    page.on('pageerror', onPageError);
  },
  async postVisit(page) {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
    const parts = [
      ...collected.console.map((t) => `[console.error] ${t}`),
      ...collected.page.map((t) => `[pageerror] ${t}`),
    ];
    if (parts.length) {
      throw new Error(parts.join('\n'));
    }
  },
};

export default config;
