import axios from 'axios';  // Default import
import getAccessToken from './oauth.js';



const inventoryUrl = 'https://elevatedequipmentsupply.acumatica.com/OData/Elevated%20Equipment%20Supply/KC_Stock_Check';

const fetchStock = async () => {

    try {

        const token = await getAccessToken();

        const requestUrl = inventoryUrl;

        // Make API GET request
        const response = await axios.get(requestUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

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

export default { fetchStock };
