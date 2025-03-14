const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.api-ninjas.com/v1',
    timeout: 10000,
    headers: {
        'X-Api-Key': 'IDhzjzTT5iXJHzZWm+5MOg==jq4TUEtRDhKXa9yf'
    }
});

async function fetchQuote(category = '') {
    try {
        console.log('Fetching quote for category:', category);
        const url = '/quotes';
        const params = category && category !== 'all' ? { category } : {};
        
        const response = await instance.get(url, { params });
        console.log('API Response:', response.data);

        if (!response.data || !response.data.length) {
            throw new Error('No quotes found');
        }

        const quote = response.data[0];
        return {
            text: quote.quote,
            author: quote.author,
            category: category || 'uncategorized'
        };
    } catch (error) {
        console.error('Quote Error:', error);
        throw new Error('Failed to fetch quote. Please try again.');
    }
}

const quotes = {
    getQuote: fetchQuote,
    categories: [
        'all',
        'inspiration',
        'life',
        'success',
        'wisdom',
        'happiness',
        'love',
        'knowledge'
    ]
};
