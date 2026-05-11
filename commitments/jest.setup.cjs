const { TextDecoder, TextEncoder } = require('node:util');

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder;
}

// jsdom stubs used by layout / data-table / TanStack Router
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}

// Smart Grid / AG-style layouts often skip row work when offset sizes are 0 in jsdom.
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 800,
});
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 1200,
});
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 800,
});
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  value: 1200,
});

require('@testing-library/jest-dom');
