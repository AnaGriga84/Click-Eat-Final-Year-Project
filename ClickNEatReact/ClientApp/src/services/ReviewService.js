import React from 'react';
import axios from 'axios';


class ReviewService
{
    getReviewsByMenuItem(menuItemId)
    {
        return axios.get('/api/ItemReviews/MenuItem/' + menuItemId);
    }

    postReview(review)
    {
        return axios.post('/api/ItemReviews', review);
    }
}
export default new ReviewService();