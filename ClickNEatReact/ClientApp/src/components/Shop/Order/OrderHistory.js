import React, { Component } from "react";
import OrderService from "../../../services/OrderService";
import { Badge, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import DuePayment from "../Payment/DuePayment";
import { Link } from "react-router-dom";
import BraintreeService from "../../../services/BraintreeService";




class OrderHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            served: [],
            current: [],
            isOpen: false,
            order: {
                total: 0,
                orderId: 0,
                token:""
            
            }
        }
        this.getPreviousOrders = this.getPreviousOrders.bind(this);
        this.payNow = this.payNow.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        this.getPreviousOrders();
    }

    async getPreviousOrders() {
        let self = this;
        OrderService.getOrderByIds(localStorage.getItem("orderIds")).then(function (resp) {
            console.log(resp.data);
            let orders = resp.data;
            for (let i = 0; i < orders.length; i++) {

                if (orders[i].status != "Served") {

                    self.state.current.push(orders[i]);


                }
                else if (orders[i].status == "Served") {
                    self.state.served.push(orders[i]);
                }
            }
            self.setState({ served: self.state.served });
            self.setState({ current: self.state.current });
        }).catch(function (error) {
            console.log(error.response);
        });


    }

    async payNow(order) {
        console.log(order);
        let self = this;

        await BraintreeService.getToken().then(function (resp) {
            order.token = resp.data.token;
        }).catch(function (error) {
            console.log(error);
            console.log(error.response);
        });
        await this.setState({
            order: order
        });
        this.toggleModal();
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
                            <div className="h3">Pay due</div>
                        </ModalHeader>
                        <ModalBody>
                            <DuePayment order={this.state.order} />
                        </ModalBody>
                    </div>
                </Modal>
            )
        }


        return (

            <div className="text-purple">
                <Row>
                    <Col>
                        <Card className="mt-3">
                            <CardHeader className="h3">
                                Current Orders
                            </CardHeader>
                            <CardBody>
                                {this.state.current.length == 0 ? "There is no orders currently!!" :

                                    <Row>
                                        {
                                            this.state.current.map(order =>
                                                <Col key={Math.random().toString(36).substring(0)} xs={12} className=" mb-4">
                                                    <Card>
                                                        <CardHeader>
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <em>Table:</em> {order.tableIdentity}<br />
                                                                    <em>Instruction:</em> {order.instruction}<br />
                                                                    <em>Status:</em> {order.status}
                                                                </div>
                                                                {order.status == "Unpaid" && <div className="col-6 align-middle custom d-flex justify-content-end align-content-center">
                                                                    <Link tag={Link} to="/" className="align-middle d-flex justify-content-end align-content-center text-decoration-none pr-2"><button className="btn btn-outline-primary">Add More Items</button> </Link>
                                                                    <button onClick={() => this.payNow(order)} className="btn btn-outline-primary">Pay Now</button>
                                                                </div>}

                                                            </div>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Row>
                                                                {
                                                                    order.orderItems.map(orderItem =>
                                                                        <Col key={Math.random().toString(36).substring(0)} xs={12} sm={6} lg={4} className=" mb-2 mt-2">
                                                                            <Card className="h-100">
                                                                                <CardImg src={orderItem.menuItem.imgPath} className="h-100" style={{ objectFit: "cover" }} />
                                                                                <CardImgOverlay className='text-center'>
                                                                                    <CardTitle className="bg-light mt-auto mb-auto">{orderItem.menuItem.name}</CardTitle>
                                                                                    <CardText className="bg-light">Quanitity:  {orderItem.itemAmmount}</CardText>
                                                                                </CardImgOverlay>
                                                                            </Card>
                                                                        </Col>
                                                                    )
                                                                }
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                            )
                                        }
                                    </Row>

                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className="mt-2">
                            <CardHeader className="h3">
                                Served Orders
                                    </CardHeader>
                            <CardBody>
                                {this.state.served.length == 0 ? "No order is served yet!!" :

                                    <Row>

                                        {this.state.served.map(order =>
                                            <Col key={Math.random().toString(36).substring(0)} xs={12} className=" mb-4">
                                                <Card>
                                                    <CardHeader>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <em>Table:</em> {order.tableIdentity}<br />
                                                                <em>Instruction:</em> {order.instruction}<br />
                                                                <em>Status:</em> {order.status}
                                                            </div>
                                                            <div className="col-6 align-middle custom d-flex justify-content-end align-content-center">
                                                                <div className="display-4"><Badge color="success">Served</Badge></div>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            {
                                                                order.orderItems.map(orderItem =>
                                                                    <Col key={Math.random().toString(36).substring(0)} xs={12} sm={6} lg={4} className=" mb-2 mt-2">
                                                                        <Card className="h-100">
                                                                            <CardImg src={orderItem.menuItem.imgPath} className="h-100" style={{ objectFit: "cover" }} />
                                                                            <CardImgOverlay className='text-center'>
                                                                                <CardTitle className="bg-light mt-auto mb-auto">{orderItem.menuItem.name}</CardTitle>
                                                                                <CardText className="bg-light">Quanitity:  {orderItem.itemAmmount}</CardText>
                                                                            </CardImgOverlay>
                                                                        </Card>
                                                                    </Col>
                                                                )
                                                            }
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>

                                        )
                                        }
                                    </Row>

                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <PaymentModal />

            </div>

        );

    }
}

export default OrderHistory;