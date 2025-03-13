import Redis, { RedisOptions } from "ioredis";

export const ConnectRedis = (options: RedisOptions) => {
  return new Redis(options);
};
