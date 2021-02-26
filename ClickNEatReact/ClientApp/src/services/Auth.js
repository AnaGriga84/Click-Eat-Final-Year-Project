import axios from "axios"


class Auth {


    verifyUser(user) {
        return axios.post('/api/Authentication/login', user);
    }

    
}

export default new Auth();