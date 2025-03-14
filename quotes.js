const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.api-ninjas.com/v1',
    timeout: 5000,
    headers: {
        'X-Api-Key': 'IDhzjzTT5iXJHzZWm+5MOg==jq4TUEtRDhKXa9yf'
    }
});

async function fetchQuote(category = '') {
    try {
        const url = '/quotes';
        const params = category && category !== 'all' ? { category } : {};
        
        const { data } = await instance.get(url, { params });
        const quote = data[0];

        return {
            text: quote.quote,
            author: quote.author,
            category: quote.category
        };
    } catch (error) {
        console.error('Quote Error:', error.message);
        throw new Error('Failed to fetch quote');
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
