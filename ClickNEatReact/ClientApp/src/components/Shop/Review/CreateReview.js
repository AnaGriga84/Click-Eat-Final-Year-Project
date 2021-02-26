import { faComment, faUser } from '@fortawesome/free-regular-svg-icons';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import MenuItemService from '../../../services/MenuItemService';
import OrderItemService from '../../../services/OrderItemService';
import ReviewService from '../../../services/ReviewService';
import './StarRating.css';



const CreateReview = (props) => {

    const [orderItem, setOrderItem] = useState(props.orderItem);
    const [reviewer, setReviewer] = useState("");
    const [rate, setRate] = useState(1);
    const [comment, setComment] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        orderItem.menuItem.menuCategory = null;
        orderItem.isReviewed = true;
        console.log(orderItem);
        let menuItem = orderItem.menuItem;
        menuItem.reviewCount = parseInt(menuItem.reviewCount) + 1;
        menuItem.avgRate = parseFloat((menuItem.reviewCount - 1) * menuItem.avgRate) + rate / parseFloat(menuItem.reviewCount)
        

        let itemReview = {
            "rate": rate,
            "comment": comment,
            "reviewer": reviewer,
            "orderItemId": orderItem.orderItemId,
            "menuItemId": orderItem.menuItem.menuItemId
        }
        
        await ReviewService.postReview(itemReview).then(async function (resp) {
            console.log(resp.data);
            await OrderItemService.putOrderItem(orderItem).then(function (res) {
                console.log(res);
                props.toggle();
            }).catch(function (error) {
                console.log(error.reponse);
            });
            //await MenuItemService.updateMenuItem(menuItem).then(function (res) {
            //    console.log(res);
            //    props.toggle();
            //}).catch(function (error) {
            //    console.log(error.reponse);
            //});
            
        }).catch(function (error) {
            console.log(error.response);
        })

        
    }

    return (
        <>
            
            <Row>
                <Col>
                    <form id="ratingForm" onSubmit={(e) => handleSubmit(e)}>
                        <div className="rating">
                            <h4>Rate it:</h4>
                            <input type="radio" id="star5" checked={rate == 5} name="rating" onChange={() => setRate(5)} value="5" /><label htmlFor="star5" title="Delicious!">5 stars</label>
                            <input type="radio" id="star4" checked={rate == 4} name="rating" onChange={() => setRate(4)} value="4" /><label htmlFor="star4" title="Yummy">4 stars</label>
                            <input type="radio" id="star3" checked={rate == 3} name="rating" onChange={() => setRate(3)} value="3" /><label htmlFor="star3" title="Meh">3 stars</label>
                            <input type="radio" id="star2" checked={rate == 2} name="rating" onChange={() => setRate(2)} value="2" /><label htmlFor="star2" title="Kinda bad">2 stars</label>
                            <input type="radio" id="star1" checked={rate == 1} name="rating" onChange={() => setRate(1)} value="1" /><label htmlFor="star1" title="Very bad">1 star</label>
                        </div>
                        <div className="clearfix"></div>
                        <div className=" form-group">

                            <div className="input-group">
                                <span>

                                    <FontAwesomeIcon icon={faUser} />
                                    <input type="text"
                                        defaultValue={reviewer}
                                        required
                                        className="form-control"
                                        placeholder={"Your Name"}
                                        onChange={(e) => setReviewer( e.target.value )}

                                    />

                                </span>
                            </div>
                        </div>
                        <div className=" form-group">

                            <div className="input-group">
                                <span className="align-items-start">

                                    <FontAwesomeIcon icon={faComment} className="mt-2" />
                                    <textarea type="text"
                                        defaultValue={comment}
                                        required
                                        className="form-control"
                                        placeholder={"Your feedback"}
                                        onChange={(e) => setComment(e.target.value)}

                                    ></textarea>

                                </span>
                            </div>
                        </div>
                        <div className="text-center custom">
                            <input type="submit" className="btn btn-outline-primary my-2 my-sm-0" value ='Submit Feedback' />
                        </div>
                        
                    </form>
                </Col>
            </Row>
        </>
        )
}

export default CreateReview;
