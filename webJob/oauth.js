import axios from 'axios';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

const cache = new NodeCache({ stdTTL: 300 }); // Cache TTL is set for 5 minutes

const clientID = process.env.ACUMATICA_CLIENT_ID;
const clientSecret = process.env.ACUMATICA_CLIENT_SECRET;
const username = process.env.ACUMATICA_USERNAME;
const password = process.env.ACUMATICA_PASSWORD;

// Define the OAuth URL
const authUrl = 'https://elevatedequipmentsupply.acumatica.com/identity/connect/token';

const getAccessToken = async () => {
    const cacheKey = 'access_token'; // Unique cache key for the token
    const cachedToken = cache.get(cacheKey);

    if (cachedToken) {
        return cachedToken;
    }

    try {
        // Construct the body using URLSearchParams
        const body = new URLSearchParams({
            grant_type: 'password',
            client_id: clientID,
            client_secret: clientSecret,
            username,
            password,
            scope: 'api openid',
        });

        // Make the POST request to get the access token
        const response = await axios.post(authUrl, body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            maxRedirects: 0,
        });

        // Optionally cache the token
        cache.set(cacheKey, response.data.access_token);

        // Return the access token from the response
        return response.data.access_token;
    } catch (error) {
        // Log the error with more details
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error details:', error.response.data);
        } else {
            console.error('Error details:');
        }
        throw error;
    }
};

export default { getAccessToken };
