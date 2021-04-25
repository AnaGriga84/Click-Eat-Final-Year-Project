import React from 'react';
import axios from 'axios';


class BraintreeService
{
    getToken()
    {
        return axios.get('/api/Braintree');
    }

    payment(data)
    {
        return axios.post('/api/Braintree', data);
    }
}
export default new BraintreeService();