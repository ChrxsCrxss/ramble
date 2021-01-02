import bluebird from "bluebird";
import redis, { RedisClient } from "redis";
import { cacheService } from "../interfaces";

/**
 * In order to use async/wait syntax, we promisify
 * redis operations to produce asynchronous variants
 * using bluebird. However, the runtime modification
 * of the RedisClient conflicts with the static type
 * analysis of TypeScript, we we suppress error
 * warning before each call to an async method
 */

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default class RedisCache implements cacheService {
  private static redisCache: RedisCache;
  private redis_client: redis.RedisClient;

  constructor() {
    //configure redis client on port 6379
    const port_redis = process.env.PORT || 6379;
    // @ts-ignore
    this.redis_client = redis.createClient(port_redis);
  }

  public getCache(): RedisCache {
    if (!RedisCache.redisCache) {
      RedisCache.redisCache = new RedisCache();
    }
    return RedisCache.redisCache;
  }

  public async addItem(item: any): Promise<boolean> {
    try {
      // @ts-ignore
      await this.redis_client.zaddAsync("sep_url_sset", "INCR", "1", item);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async getSortedSet(): Promise<any[]> {
    // @ts-ignore
    return await this.redis_client.zrevrangeAsync("sep_url_sset", 0, -1);
  }

  public async clearCache(): Promise<boolean> {
    try {
      // @ts-ignore
      this.redis_client.delAsync("sep_url_sset");
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
