import React from 'react';
import axios from 'axios';

class OrderItemService {

    putOrderItem(orderItem) {
        return axios.put('/api/OrderItems/' + orderItem.orderItemId, orderItem);
    }

}

export default new OrderItemService();