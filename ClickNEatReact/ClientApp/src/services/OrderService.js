import { config } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';


class OrderService {

    getOrders() {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        return axios.get('/api/Orders', config);

    }

    getOrder(orderId) {
        

        return axios.get('/api/Orders/' + orderId);

    }

    getOrderByIds(ids) {
        
        var data = JSON.stringify(ids);

        var config = {
            method: 'post',
            url: '/api/Orders/userOrders/ids',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config);
    }

    insertOrder(order) {
        
        return axios.post('/api/Orders', order);

    }
    updateOrderToAddItem(order) {

       
        //console.log(category);
        return axios.put('/api/orders/' + order.orderId +'/addItems', order);

    }

    updateOrder(order) {

        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        //console.log(category);
        return axios.put('/api/orders/' + order.orderId, order, config);

    }

    //DeleteCategory(categoryId) {
    //    var config = {
    //        headers: {
    //            'Authorization': 'Bearer ' + localStorage.getItem('token')
    //        }
    //    }
    //    return axios.delete('/api/MenuCategories/' + categoryId, config);
    //}
}

export default new OrderService();