/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface IdleRequestOptions {
  timeout?: number;
}

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface Window {
  requestIdleCallback?(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
  cancelIdleCallback?(handle: number): void;
}
