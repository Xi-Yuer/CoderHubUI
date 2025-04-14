declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_LOCAL_BASE_URL: string;
    readonly NEXT_PUBLIC_SERVER_API_BASE_URL: string;
    readonly NEXT_PUBLIC_LOCAL_API_BASE_URL: string;
    readonly NEXT_PUBLIC_REDIS_HOST: string;
    readonly NEXT_PUBLIC_SITE_DOMAIN: string;
    readonly NEXT_PUBLIC_WEBSOCKET_URL: string;
  }
}
