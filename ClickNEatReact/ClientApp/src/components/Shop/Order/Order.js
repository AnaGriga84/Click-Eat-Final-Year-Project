import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle, Col, Row } from 'reactstrap';
import OrderService from '../../../services/OrderService';

class Orders extends Component {
    static displayName = Orders.name;
    constructor(props) {
        super(props);
        this.state = {
            served: [],
            current: []
        }
        this.getOrders = this.getOrders.bind(this);
        this.serveOrder = this.serveOrder.bind(this);
    }


    componentDidMount() {
        this.getOrders();
    }
    async serveOrder(order) {
        order.status = "Served";
        OrderService.updateOrder(order).then(function (resp) {
            console.log(resp.data);
        }).catch(function (error) {
            console.log(error.response);
        });
        this.forceUpdate();
    }

    async getOrders() {
        let self = this;
        this.state.current.length = 0;
        await OrderService.getOrders().then(function (resp) {
            console.log(resp.data);
            let orders = resp.data;
            for (let i = 0; i < orders.length; i++) {

                if (orders[i].status != "Served") {

                    self.state.current.push(orders[i]);


                }
            }
        }).catch(function (error) {
            console.log(error);
        });


       
        await this.setState({ current: this.state.current });
        //console.log(this.state.current.length);
        setTimeout(() => this.getOrders(), 5000);
    }

    render() {
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
                                                <Col key={Math.random().toString(36).substring(0)} xs={12 } className=" mb-4">
                                                    <Card>
                                                        <CardHeader>
                                                            <div className="row">
                                                            <div className="col-6">
                                                            <em>Table:</em> {order.tableIdentity}<br/>
                                                            <em>Instruction:</em> {order.instruction}<br />
                                                            <em>Status:</em> {order.status}
                                                                </div>
                                                                <div className="col-6 align-middle custom d-flex justify-content-end align-content-center">
                                                                    <button onClick={() => this.serveOrder(order)} className="btn btn-outline-primary">Mark as served</button>
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
                                                                            <CardImgOverlay className= 'text-center'>
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
                {
                //    <Row>
                //    <Col>
                //        <Card className="mt-2">
                //            <CardHeader className="h3">
                //                Served Orders
                //            </CardHeader>
                //            <CardBody>
                //                {this.state.served.length == 0 ? "No order is served yet!!" :

                //                    <Row>
                                        
                //                            this.state.served.map(order =>
                //                                <Col key={Math.random().toString(36).substring(0)} xs={12} className=" mb-4">
                //                                    <Card>
                //                                        <CardHeader>
                //                                            <div className="row">
                //                                                <div className="col-6">
                //                                                    <em>Table:</em> {order.tableIdentity}<br />
                //                                                    <em>Instruction:</em> {order.instruction}<br />
                //                                                    <em>Status:</em> {order.status}
                //                                                </div>
                //                                                <div className="col-6 align-middle custom d-flex justify-content-end align-content-center">
                //                                                    <div className="display-4"><Badge color="success">Served</Badge></div>
                //                                                </div>
                //                                            </div>
                //                                        </CardHeader>
                //                                        <CardBody>
                //                                            <Row>
                //                                                {
                //                                                    order.orderItems.map(orderItem =>
                //                                                        <Col key={Math.random().toString(36).substring(0)} xs={12} sm={6} lg={4} className=" mb-2 mt-2">
                //                                                            <Card className="h-100">
                //                                                                <CardImg src={orderItem.menuItem.imgPath} className="h-100" style={{ objectFit: "cover" }} />
                //                                                                <CardImgOverlay className='text-center'>
                //                                                                    <CardTitle className="bg-light mt-auto mb-auto">{orderItem.menuItem.name}</CardTitle>
                //                                                                    <CardText className="bg-light">Quanitity:  {orderItem.itemAmmount}</CardText>
                //                                                                </CardImgOverlay>
                //                                                            </Card>
                //                                                        </Col>
                //                                                    )
                //                                                }
                //                                            </Row>
                //                                        </CardBody>
                //                                    </Card>
                //                                </Col>

                //                            )
                                        
                //                    </Row>

                //                }
                //            </CardBody>
                //        </Card>
                //    </Col>
                //</Row>
                }
            </div>
        );
    }
}

export default Orders;