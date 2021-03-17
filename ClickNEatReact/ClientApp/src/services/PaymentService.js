import { config } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';


class PaymentService {

    getPayments() {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        return axios.get('/api/Payments', config);

    }

    getSalesByPeriod(period) {
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        return axios.get('/api/Payments/period/' + period, config);

    }

    insertPayment(payment) {
        
        return axios.post('/api/Payments', payment);

    }

    insertDuePayment(payment) {
        
        return axios.post('/api/Payments/DuePayment', payment);

    }

    //updateCategory(category) {
    //    var config = {
    //        headers: {
    //            'Authorization': 'Bearer ' + localStorage.getItem('token')
    //        }
    //    }
    //    //console.log(category);
    //    return axios.put('/api/MenuCategories/' + category.categoryId, category, config);

    //}

    //DeletePayment(paymentId) {
    //    var config = {
    //        headers: {
    //            'Authorization': 'Bearer ' + localStorage.getItem('token')
    //        }
    //    }
    //    return axios.delete('/api/MenuCategories/' + categoryId, config);
    //}
}

export default new PaymentService();