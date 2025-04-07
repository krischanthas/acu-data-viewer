import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  tls: {
    rejectUnauthorized: false, // Required for Azure Redis SSL
  },
});

export default redis;
