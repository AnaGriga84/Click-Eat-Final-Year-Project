import axios from "axios"

class Auth
{
    verifyUser(user)
    {
        return axios.post('/api/Authentication/login', user);
    }

    changePassword(passwordData)
    {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.post('/api/Authentication/changePassword/' + localStorage.getItem("username"), passwordData, config);
    }
}

export default new Auth();