import React, { Component } from 'react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, CardColumns, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import CreateWaiter from '../Management/Waiter/CreateWaiter';
import WaiterService from '../../services/WaiterService';


export default class Waiter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: 'index',
            waiters: [],
            waiter: {
                id: "",
                firstName: "",
                lastName: "",
                userName: "",
                phoneNumber: "",
                email:""
            },
            isModalOpen:false
        }

        this.getWaiters = this.getWaiters.bind(this);
        this.Delete = this.Delete.bind(this);
        this.ConfirmDelete = this.ConfirmDelete.bind(this);
    }

    componentDidMount() {
        this.getWaiters();
    }

    getWaiters() {
        let self = this;
        WaiterService.getWaiters().then(function (resp) {
            console.log(resp.data.user);
            self.setState({ waiters: resp.data.user });
        }).catch(function (error) {
            console.log(error.response);
        });
    }


    async ConfirmDelete(waiter) {
        await this.setState({ waiter: waiter });
        this.setState({ isModalOpen: true });
    }
    async Delete(waiter) {

        let self = this;
        this.setState({ isModalOpen: false });
        WaiterService.deleteWaiter(waiter.userName).then(function (resp) {
            self.getWaiters();
        }).catch(function (error) {
            console.log(error.response);
        });

    }

    render() {

        const ConfirmDeleteModal = () => {
            return (
                <Modal returnFocusAfterClose={true} isOpen={this.state.isModalOpen} className="modal-dialog-centered" >
                    <ModalHeader className="text-danger">
                        <FontAwesomeIcon icon={faExclamationCircle} size={"lg"} /> Are you sure to delete the waiter account?
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <h6><em className="font-weight-bold">ID:</em> {this.state.waiter.id}</h6>
                                <h6><em className="font-weight-bold">Name:</em> {this.state.waiter.firstName + " " + this.state.waiter.lastName}</h6>
                                <h6><em className="font-weight-bold">Username:</em> {this.state.waiter.userName}</h6>
                                <h6><em className="font-weight-bold">Phone:</em> {this.state.waiter.phoneNumber}</h6>
                                <h6><em className="font-weight-bold">Email:</em> {this.state.waiter.email}</h6>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.Delete(this.state.waiter)} className="btn  btn-danger">Yes</Button>
                        <Button onClick={() => this.setState({ isModalOpen: false })} className="btn  btn-primary" > No</Button>
                    </ModalFooter>
                </Modal>
            )
        }

        return (
            <>
                {
                    this.state.mode === 'index' &&
                    <div className="row mt-4">
                        <div className="col-12">

                            {this.state.waiters.length < 1 ?
                                <div className="row">
                                    <div className="col-12 h3">
                                        No waiter accounts added yet
                                <Button className="btn btn-outline-success float-right" onClick={() => this.setState({ mode: 'create' })}>Add New Account</Button>
                                    </div>
                                </div> :
                                <>
                                    <div className="row">
                                        <div className="col-12 h3">
                                            Waiter accounts
                                <Button className="btn btn-outline-success float-right" onClick={() => this.setState({ mode: 'create' })}>Add New Account</Button>

                                        </div>
                                    </div>
                                    <Row className="mt-4">

                                        {
                                            this.state.waiters.map(waiter =>


                                                <Col key={Math.random().toString(36).substring(0)} xs={12} xs={12} sm={6} lg={4} className=" mb-4">
                                                    <Card className="menuItemCard" >
                                                        <CardBody className="text-purple">
                                                            <h6><em className="font-weight-bold">Name:</em> {waiter.firstName + " " + waiter.lastName}</h6>
                                                            <h6><em className="font-weight-bold">Username:</em> {waiter.userName}</h6>
                                                            <h6><em className="font-weight-bold">Phone:</em> {waiter.phoneNumber}</h6>
                                                            <h6><em className="font-weight-bold">Email:</em> {waiter.email}</h6>
                                                            <button onClick={() => this.ConfirmDelete(waiter)} className="btn btn-outline-danger my-0">Delete</button>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                            )
                                        }

                                    </Row>
                                </>
                            }
                            
                        </div>
                    </div>

                }
                {
                    this.state.mode === 'create' && <div>
                        <CreateWaiter />
                    </div>
                }
                <ConfirmDeleteModal />
            </>
        )

    }

}