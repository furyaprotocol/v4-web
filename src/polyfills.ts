import { Buffer } from 'buffer';

// @ts-ignore
globalThis.process ??= { env: {} }; // Minimal process polyfill
globalThis.global ??= globalThis;
globalThis.Buffer ??= Buffer;

declare global {
  interface WindowEventMap {
    'furya:log': CustomEvent;
    'furya:track': CustomEvent;
    'furya:identify': CustomEvent;

    'abacus:connectNetwork': CustomEvent;
  }

  var Intercom: any;
}
