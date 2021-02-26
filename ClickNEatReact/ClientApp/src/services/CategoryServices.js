import { config } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';


class CategoryService {

    getCategories() {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        return axios.get('/api/MenuCategories', config);

    }

    insertCategory(category) {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.post('/api/MenuCategories', category, config);

    }

    updateCategory(category) {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        //console.log(category);
        return axios.put('/api/MenuCategories/' + category.categoryId, category, config);

    }

    DeleteCategory(categoryId) {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        return axios.delete('/api/MenuCategories/' + categoryId, config);
    }
}

export default new CategoryService();