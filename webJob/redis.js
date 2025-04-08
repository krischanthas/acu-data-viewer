import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
    tls: {
        rejectUnauthorized: false, // Required for Azure Redis SSL
    },
});

// Export `set` method
export const set = async (key, value, mode, ttl) => {
    return await redis.set(key, value, mode, ttl);
};

export default redis;
