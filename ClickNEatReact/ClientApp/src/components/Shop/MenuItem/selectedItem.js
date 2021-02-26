import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timers } from 'jquery';
import React, { Component } from 'react'
import { Card, CardBody, CardImg, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import BraintreeService from '../../../services/BraintreeService';
import OrderService from '../../../services/OrderService';
import CreatePayment from '../Payment/CreatePayment';


export default class SelectedItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: {},
            totalPrice: 0,
            instruction: "",
            table: "",
            order: {
                selectedItems: {},
                totalPrice: 0,
                instruction: "",
                table: '',
                token:""
            },
            isOpen: false,
            payType:"",

        }

        this.changeQuantity = this.changeQuantity.bind(this);
        this.proceedToCheckOut = this.proceedToCheckOut.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount() {
        if (localStorage.getItem('selectedItems') != undefined) {
            this.setState({ selectedItems: JSON.parse(localStorage.getItem('selectedItems')) });
            let total = 0;
            Object.values(JSON.parse(localStorage.getItem('selectedItems'))).forEach((item, index) => {
                console.log(item.itemAmmount);
                console.log(item.price);
                total += parseInt(item.itemAmmount) * parseFloat(item.price);
            });
            total = total.toFixed(2);
            this.setState({ totalPrice: total });
        }

        



    }

    async changeQuantity(key, qty) {
        let diff = qty - this.state.selectedItems[key].itemAmmount
        this.state.selectedItems[key].itemAmmount = qty;
        await this.setState({ selectedItems: this.state.selectedItems });

        let total = parseFloat(this.state.totalPrice);
        total += parseInt(diff) * parseFloat(this.state.selectedItems[key].price);

        this.setState({ totalPrice: total.toFixed(2) });

        localStorage.setItem('dishItemCount', parseInt(localStorage.getItem('dishItemCount')) + diff);
        localStorage.setItem('selectedItems', JSON.stringify(this.state.selectedItems));



        this.props.updateThis();

    }

    async proceedToCheckOut(e) {
        e.preventDefault();

        console.log(localStorage.getItem('pendingPayment'));

        let order = {
            selectedItems: this.state.selectedItems,
            totalPrice: this.state.totalPrice,
            instruction: this.state.instruction,
            table: this.state.table,
            token:""
        }
        
        if (this.state.payType == 'now') {
            let self = this;

            await BraintreeService.getToken().then(function (resp) {
                order.token = resp.data.token;
            }).catch(function (error) {
                console.log(error);
                console.log(error.response);
            });

            await this.setState({ order: order });
            this.toggleModal();
        }
        else {
            await this.setState({ order: order });
            console.log(this.state.payType);

            if (localStorage.getItem('pendingPayment') == null || localStorage.getItem('pendingPayment') == undefined) {
                let selectedOrderItems = Object.values(this.state.selectedItems);
                let orderItems = [];

                for (let i = 0; i < selectedOrderItems.length; i++) {
                    console.log(selectedOrderItems[i]);

                    let selecteditem = selectedOrderItems[i];
                    if (selecteditem.itemAmmount != 0) {
                        let orderItem = {
                            "itemAmmount": parseInt(selecteditem.itemAmmount),
                            "price": selecteditem.price,
                            "menuItemId": selecteditem.menuItemId,
                            "orderItemStatus": "Unserved",
                        }
                        orderItems.push(orderItem);

                    }

                    



                }

                let order = {
                    "total": this.state.totalPrice,
                    "instruction": this.state.instruction,
                    "tableIdentity": this.state.table,
                    "status": "Unpaid",
                    "orderItems": orderItems
                }

                console.log(order);

                OrderService.insertOrder(order).then(function (resp) {
                    localStorage.setItem('pendingPayment', resp.data.orderId);
                    console.log(resp.data);
                    localStorage.removeItem("selectedItems");
                    localStorage.removeItem('dishItemCount');
                    let orderIds = (localStorage.getItem('orderIds') != null || localStorage.getItem('orderIds') != undefined) ? localStorage.getItem('orderIds') : "";
                    console.log(orderIds);
                    orderIds += ' ' + resp.data.orderId;
                    localStorage.setItem('orderIds', orderIds);
                    window.location.href = "/orderHistory";
                }).catch(function (error) {
                    console.log(error);
                    console.log(error.response);
                });


            }
            else {
                let self = this;
                let selectedOrderItems = Object.values(this.state.selectedItems);
                let orderItems = [];

                for (let i = 0; i < selectedOrderItems.length; i++) {
                    console.log(selectedOrderItems[i]);

                    let selecteditem = selectedOrderItems[i];
                    if (selecteditem.itemAmmount != 0) {
                        let orderItem = {
                            "itemAmmount": parseInt(selecteditem.itemAmmount),
                            "price": selecteditem.price,
                            "menuItemId": selecteditem.menuItemId,
                            "orderItemStatus": "Unserved",
                        }
                        orderItems.push(orderItem);

                    }

                    

                    



                }
                let order = {
                    "orderId": localStorage.getItem('pendingPayment'),
                    "total": this.state.totalPrice,
                    "instruction": this.state.instruction,
                    "tableIdentity": this.state.table,
                    "status": "Unpaid",
                    "orderItems": orderItems
                }
                console.log(order);
                OrderService.updateOrderToAddItem(order).then(function (resp) {
                    console.log(resp.data);
                    localStorage.removeItem("selectedItems");
                    localStorage.removeItem('dishItemCount');
                    window.location.href = "/orderHistory";
                }).catch(function (error) {
                    console.log(error.response);
                });
                
                
            }
            
        }
        
    }

    toggleModal() {
        this.setState({ isOpen: !this.state.isOpen });


    }


    render() {

        const PaymentModal = () => {
            return (
                <Modal className={" rounded text-purple"} isOpen={this.state.isOpen} centered scrollable backdrop="static"  >
                    <div className="shadow-custom">

                        <ModalHeader toggle={this.toggleModal}>
                            <div className="h3">Checkout</div>
                        </ModalHeader>
                        <ModalBody>
                            <CreatePayment order={this.state.order} />
                        </ModalBody>
                    </div>
                </Modal>
            )
        }

        return (
            <>
                {Object.keys(this.state.selectedItems).length < 1 &&
                    <div>
                        No Menu Items Selected
                    </div>
                }
                {Object.keys(this.state.selectedItems).length > 0 &&


                    < Row className="mt-4">
                        <Col xs={12} md={6} lg={8}>
                            <h4>Your Order</h4>
                            <Row className="overflow-auto " style={{ height: '350px' }}>
                                {
                                    Object.keys(this.state.selectedItems).map((key) =>

                                        <Col key={Math.random().toString(36).substring(0)} xs={12} xs={12} lg={6} className=" mt-2 mb-2" >
                                            <Card className="shadow-custom" style={{ height: '300px' }}>
                                                <CardImg top src={this.state.selectedItems[key].imgPath} style={{ height: '150px', objectFit: "cover" }} />
                                                <CardBody>

                                                    <h6><em className="font-weight-bold">Name:</em> {this.state.selectedItems[key].name}</h6>
                                                    <h6><em className="font-weight-bold">Price:</em> {this.state.selectedItems[key].price}<FontAwesomeIcon icon={faEuroSign} />{' * ' + this.state.selectedItems[key].itemAmmount + ' = ' + (this.state.selectedItems[key].itemAmmount * this.state.selectedItems[key].price).toFixed(2)}<FontAwesomeIcon icon={faEuroSign} /></h6>

                                                    <h6><em className="font-weight-bold">Category:</em> {this.state.selectedItems[key].menuCategory.name}</h6>


                                                    <form className="form-inline">
                                                        <h6><em className="font-weight-bold">Quantity:</em> <input onChange={(e) => this.changeQuantity(key, e.target.value)} className="form-control" style={{ width: '30%', minWidth: '30%' }} type={'number'} min={0} defaultValue={this.state.selectedItems[key].itemAmmount} /></h6>
                                                    </form>

                                                </CardBody>

                                            </Card>
                                        </Col>

                                    )
                                }
                            </Row>
                        </Col>
                        <Col xs={12} md={6} lg={4}>
                            <form onSubmit={this.proceedToCheckOut}>

                                <Card className="mt-md-5 ">
                                    <CardBody>
                                    <table className="table text-purple">
                                            <tbody>

                                                <tr>
                                                    <td>
                                                        Total
                                                    </td>
                                                    <td className="text-center">
                                                        {this.state.totalPrice} <FontAwesomeIcon icon={faEuroSign} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2">
                                                        <div className="mb-2">
                                                            Special Instructions
                                                    <textarea className='form-control' onChange={(e) => this.setState({ instruction: e.target.value })}></textarea>
                                                        </div>
                                                        <div>
                                                            Table
                                                    <input type="text" className='form-control' required onChange={(e) => this.setState({ table: e.target.value })} />
                                                        </div>
                                                    </td>
                                                </tr>

                                                
                                            </tbody>
                                    </table>
                                    <div className="text-center form-group align-middle">
                                        <button onClick={() => this.setState({ payType: "now" })} role="submit" className="btn btn-custom" >Proceed to checkout</button>
                                    </div>
                                    <div className="text-center align-middle">
                                        <button onClick={() => this.setState({ payType:"later" })} role="submit" className="btn btn-warning" >Place Order & Pay Later</button>
                                    </div>
                                    </CardBody>
                                </Card>
                            </form>
                        </Col>
                    </Row>

                }
                <PaymentModal />
            </>
        )
    }
}