import { faEllipsisH, faEuroSign, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'jquery';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardImg, Col, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import MenuItemService from '../../../services/MenuItemService';
import CreateMenuItem from './CreateMenuItem';
import EditMenuItem from './EditMenuItem';



export default class MenuItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mode: 'index',
            menus: [],
            menu: {},
            isModalOpen: false,
        }

        this.getMenuItems = this.getMenuItems.bind(this);
        this.Delete = this.Delete.bind(this);
        this.ConfirmDelete = this.ConfirmDelete.bind(this);
    }

    componentDidMount() {
        this.getMenuItems();
    }

    getMenuItems() {
        let self = this;
        MenuItemService.getMenuItem().then(async function (resp) {
            
            console.log(resp);
            await self.setState({ menus: resp.data });
        }).catch(function (error) {
            console.log(error.response);
        });
    }

    async ConfirmDelete(menu) {
        await this.setState({ menu: menu });
        this.setState({ isModalOpen: true });
    }

    async Delete(menu) {

        MenuItemService.deleteMenuItem(menu.menuItemId).then(function (resp) {
            console.log(resp);
            window.location.reload(false);
        }).catch(function (error) {
            console.log(error.response);
        });

    }

    async setEditMode(menu) {
        await this.setState({ menu: menu });
        await this.setState({ mode: 'edit' });
    }

    render() {

        const ConfirmDelete = () => {
            return (
                <Modal centered  returnFocusAfterClose={true} isOpen={this.state.isModalOpen} className="modal-dialog-centered" >
                    <ModalHeader className="text-danger">
                        <FontAwesomeIcon icon={faExclamationCircle} size={"lg"} /> Are you sure to delete this menu item?
                    </ModalHeader>
                    <ModalBody>
                        
                        <Card className="shadow-custom">
                            <CardImg top src={this.state.menu.imgPath} />
                            <CardBody>
                                <h6><em className="font-weight-bold">ID:</em> {this.state.menu.menuItemId}</h6>
                                <h6><em className="font-weight-bold">Name:</em> {this.state.menu.name}</h6>
                                <h6><em className="font-weight-bold">Price:</em> {this.state.menu.price}<FontAwesomeIcon icon={faEuroSign} /></h6>
                                <h6><em className="font-weight-bold">Availability:</em> {this.state.menu.availability ? "Available" : "Unavailable"}</h6>
                                <h6><em className="font-weight-bold">Special Dietary:</em> {this.state.menu.isVegan ? "Vegetarian" : "Non Vegetarian"}</h6>
                                <h6><em className="font-weight-bold">Category:</em> {this.state.menu.menuCategory == undefined ? "" : this.state.menu.menuCategory.name}</h6>
                                <h6><em className="font-weight-bold">Description:</em> {this.state.menu.description}</h6>
                                <h6><em className="font-weight-bold">Allergens:</em> {this.state.menu.allergens}</h6>
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.Delete(this.state.menu)} className="btn  btn-danger">Yes</Button>
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
                            {this.state.menus.length < 1 ?
                                <div className="row">
                                    <div className="col-12 h3">
                                        No menu items added yet
                                <Button className="btn btn-outline-success float-right" onClick={() => this.setState({ mode: 'create' })}>Add menu item</Button>
                                    </div>
                                </div> :
                                <>
                                    <div className="row">
                                        <div className="col-12 h3">
                                            Menu Items
                                        <Button className="btn btn-outline-success float-right" onClick={() => this.setState({ mode: 'create' })}>Add menu item</Button>
                                        </div>
                                    </div>
                                    <Row className="mt-4">
                                        {
                                            this.state.menus.map((menu) =>

                                                <Col key={Math.random().toString(36).substring(0)} xs={12} xs={12} sm={6 }  lg={4} className=" mb-4" >
                                                    <Card className="shadow-custom h-100">
                                                        <CardImg top src={menu.imgPath} />
                                                        <CardBody>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle nav className="text-right p-0">
                                                                    <FontAwesomeIcon icon={faEllipsisH} size={"lg"} />
                                                                </DropdownToggle>
                                                                <DropdownMenu right>
                                                                    <DropdownItem><span style={{ cursor: "pointer" }} onClick={() => this.setEditMode(menu)} className="btn btn-block btn-custom" > Edit</span></DropdownItem>
                                                                    <DropdownItem><span style={{ cursor: "pointer" }} onClick={() => this.ConfirmDelete(menu)} className="btn btn-block btn-danger">Delete</span></DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                            <h6><em className="font-weight-bold">Name:</em> {menu.name}</h6>
                                                            <h6><em className="font-weight-bold">Price:</em> {menu.price}<FontAwesomeIcon icon={faEuroSign} /></h6>
                                                            <h6><em className="font-weight-bold">Availability:</em> {menu.availability ? "Available" : "Unavailable"}</h6>
                                                            <h6><em className="font-weight-bold">Special Dietary:</em> {menu.isVegan ? "Vegetarian" : "Non Vegetarian"}</h6>
                                                            <h6><em className="font-weight-bold">Category:</em> {menu.menuCategory.name}</h6>
                                                            <h6><em className="font-weight-bold">Description:</em> {menu.description}</h6>
                                                            <h6><em className="font-weight-bold">Allergens:</em> {menu.allergens}</h6>                                                                                            
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
                        <CreateMenuItem/>
                    </div>
                }
                {
                    this.state.mode === 'edit' && <div>
                        <EditMenuItem menu={this.state.menu} />
                    </div>
                }
                <ConfirmDelete/>
            </>

        )
    }

}