import axios from 'axios';


class MenuItemService {

    getMenuItem() {

        return axios.get('/api/MenuItems');

    }

    insertMenuItem(menu) {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        return axios.post('/api/MenuItems', menu, config);

    }

    updateMenuItem(menu) {
        //console.log(category);
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.put('/api/MenuItems/' + menu.menuItemId, menu, config);

    }

    deleteMenuItem(id) {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.delete('/api/MenuItems/' + id, config);
    }
}

export default new MenuItemService();