import axios from 'axios';
import { getAccessToken } from './oauth';
import NodeCache from 'node-cache';

// Initialize cache with a time-to-live (TTL) of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

const inventoryUrl = 'https://elevatedequipmentsupply.acumatica.com/OData/Elevated%20Equipment%20Supply/KC_Stock_Check';

export const fetchStock = async (searchQuery: string) => {
  // Check if data is cached
  const cacheKey = `stock_${searchQuery}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Get access token
    const token = await getAccessToken();

    // Construct the request URL with the searchQuery parameter
    const requestUrl = `${inventoryUrl}?$filter=InventoryID eq '${encodeURIComponent(searchQuery)}'`;

    // Make API GET request
    const response = await axios.get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Cache the response data
    cache.set(cacheKey, response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    // Log the full error for debugging
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
      } else {
        console.error('Error message:', error.message);
      }
    }
    throw error;
  }
};
