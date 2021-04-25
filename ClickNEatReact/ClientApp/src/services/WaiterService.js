import axios from 'axios';

class WaiterService
{
    PostWaiter(waiter)
    {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.post('/api/Authentication/register/waiter', waiter, config);
    }

    getWaiters()
    {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.get('/api/Authentication/users/waiters', config);
    }

    deleteWaiter(username)
    {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.delete('/api/Authentication/user/' + username, config);
    }
}
export default new WaiterService();