import redis from "express-redis-cache";

const redisCache = redis({
  host: "localhost",
  port: 6379,
  prefix: "cache",
  expire: 60 * 60 * 24, // 1 Day
});

export default redisCache;
