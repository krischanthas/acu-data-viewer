import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });  // Cache TTL is set for 5 minutes

const clientID: string = process.env.ACUMATICA_CLIENT_ID as string;
const clientSecret: string = process.env.ACUMATICA_CLIENT_SECRET as string;
const username: string = process.env.ACUMATICA_USERNAME as string;
const password: string = process.env.ACUMATICA_PASSWORD as string;

// Define the OAuth URL
const authUrl: string = 'https://elevatedequipmentsupply.acumatica.com/identity/connect/token';

export const getAccessToken = async (): Promise<string> => {
  const cacheKey = 'access_token';  // Unique cache key for the token
  const cachedToken = cache.get(cacheKey) as string | undefined;

  if (cachedToken) {
    return cachedToken;
  }

  try {
    // Construct the body using URLSearchParams
    const body = new URLSearchParams({
      grant_type: 'password',  // Ensure you're using the correct grant_type
      client_id: clientID,
      client_secret: clientSecret,
      username,
      password,
      scope: 'api openid',  // Ensure the scope is correct for your application
    });

    // Make the POST request to get the access token
    const response: AxiosResponse = await axios.post(authUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Correct content-type
      },
    });

    // Return the access token from the response
    return response.data.access_token;
  } catch (error) {
    // Log the error with more details
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error details:', error.response.data);
    } else {
      console.error('Error details:');
    }
    throw error;  // Rethrow the error to handle it in other parts of the app
  }
};
