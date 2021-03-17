import React from 'react';
import axios from 'axios';


class UserService {

    postUser(user) {
        
        return axios.post('/api/Authentication/register/user', user)
    }

}

export default new UserService();