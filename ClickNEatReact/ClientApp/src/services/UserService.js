import React from 'react';
import axios from 'axios';


class UserService
{
    postUser(user)
    {        
        return axios.post('/api/Authentication/register/user', user)
    }

    getCustomers()
    {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.get('/api/Authentication/users/customers', config);
    }
}
export default new UserService();