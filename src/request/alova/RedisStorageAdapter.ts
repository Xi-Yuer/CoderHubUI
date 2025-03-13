import Redis, { RedisOptions } from "ioredis";
import { AlovaGlobalCacheAdapter } from "alova";

export class RedisStorageAdapter implements AlovaGlobalCacheAdapter {
  private client: Redis;
  private cachePrefix: string;

  constructor(options: RedisOptions, cachePrefix = "alova:") {
    this.client = new Redis(options);
    this.cachePrefix = cachePrefix;
  }

  // Save or update cache
  async set(key: string, value: [any, number]) {
    const [data, expireTs] = value;
    console.log(expireTs);
    const now = Date.now();
    const dataToStore = JSON.stringify(data);

    // Calculate the TTL in milliseconds
    const ttl = expireTs - now;
    if (ttl > 0) {
      await this.client.set(this.cachePrefix + key, dataToStore, "PX", ttl);
    }
  }

  // Get value by key
  async get<T>(key: string): Promise<T | undefined> {
    const data = await this.client.get(this.cachePrefix + key);
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  }

  // Remove item
  async remove(key: string) {
    await this.client.del(this.cachePrefix + key);
  }

  // Clear all cache
  async clear() {
    console.log("redis cache clear is not allowed");
  }
}
