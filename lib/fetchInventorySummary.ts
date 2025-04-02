import axios from 'axios';
import { getAccessToken } from './oauth';
import NodeCache from 'node-cache';

// Initialize cache with a time-to-live (TTL) of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

const inventoryUrl = 'https://elevatedequipmentsupply.acumatica.com/(W(1))/entity/Default/20.200.001/InventorySummaryInquiry?%24expand=Results';

export const fetchInventorySummary = async (searchQuery: string) => {
  // Check if data is cached
  const cacheKey = `inventorySummary_${searchQuery}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Get access token
    const token = await getAccessToken();



    // Make API request with search parameter
    const response = await axios.put(inventoryUrl, {
        InventoryID: {
          value: searchQuery,
        },
      }, {
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
