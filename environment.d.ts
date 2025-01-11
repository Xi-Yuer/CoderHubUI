declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_CLIENT_BASE_URL: string;
    readonly NEXT_PUBLIC_SERVER_BASE_URL: string;
    readonly NEXT_PUBLIC_LOCAL_BASE_URL: string;
  }
}
