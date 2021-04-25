import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import UserService from '../../services/UserService';


export default class Customers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: []
        }

        this.getCustomers = this.getCustomers.bind(this);
    }

    componentDidMount() {
        this.getCustomers();
    }

    getCustomers() {
        let self = this;
        UserService.getCustomers().then(function (resp) {
            console.log(resp.data.user);
            self.setState({ customers: resp.data.user });
        }).catch(function (error) {
            console.log(error.response);
        });
    }

    render() {
        return (
            <>
                {
                    this.state.customers.length > 0 ?
                        <Row className="mt-4">
                            <Col>
                                <h4>Customer Accounts</h4>
                                <Row>
                                    {
                                        this.state.customers.map(customer =>
                                            <Col key={Math.random().toString(36).substring(0)} xs={12} xs={12} sm={6} lg={4} className=" mb-4">
                                                <Card className="menuItemCard" >
                                                    <CardBody className="text-purple">
                                                        <h6><em className="font-weight-bold">Name:</em> {customer.firstName + " " + customer.lastName}</h6>
                                                        <h6><em className="font-weight-bold">Username:</em> {customer.userName}</h6>
                                                        <h6><em className="font-weight-bold">Phone:</em> {customer.phoneNumber}</h6>
                                                        <h6><em className="font-weight-bold">Email:</em> {customer.email}</h6>
                                                        
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </Col>
                        </Row>
                        :
                        <Row className="mt-4">
                            <Col>
                                <div style={{ height: "500px" }} className="d-flex align-content-center justify-content-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                }
            </>
        )
    }
}