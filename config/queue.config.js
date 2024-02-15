export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export const defaultQueueConfig = {
  removeOnComplete: {
    count: 100, // count of completed jobs to keep in queue
    age: 60 * 60 * 6, // keep completed jobs for 6 hrs
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000, // delay between attempts in milliseconds
  },
};
