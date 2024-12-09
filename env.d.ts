declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_COOKIE: string;
    }
  }
}

export {};
