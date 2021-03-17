import { faCaretDown, faCaretUp, faEuroSign, faInfoCircle, faPlusCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardImg, Col, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Row, UncontrolledTooltip, CardImgOverlay, Badge, UncontrolledCollapse } from 'reactstrap';
import MenuItemService from '../services/MenuItemService';
import ReviewService from '../services/ReviewService';
import SelectedItem from './Management/MenuItem/selectedItem';
import './Management/Review/StarRating.css'


export class Home extends Component {
    static displayName = Home.name; constructor(props) {
        super(props)

        this.state = {
            menus: [],
            selectedItems: {},
            reviews: [],
            menusByCategory: {},
            isOpen: false,
            menuItem: {},
            isInfoOpen: false
        }

        this.getMenuItems = this.getMenuItems.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getReviewes = this.getReviewes.bind(this);
        this.showMenuDetails = this.showMenuDetails.bind(this);
        this.toggleInfoModal = this.toggleInfoModal.bind(this);


    }

    async componentDidMount() {
        this.getMenuItems();
        if (localStorage.getItem('selectedItems') != undefined) {
            await this.setState({ selectedItems: JSON.parse(localStorage.getItem('selectedItems')) });
        }
        ///console.log(this.state.selectedItems);

    }

    async getMenuItems() {
        let self = this;
        await this.setState({ menusByCategory: {} });
        MenuItemService.getMenuItem().then(async function (resp) {

            //console.log(resp);
            let data = resp.data;
            //console.log(data);
            await self.setState({ menus: data });
            //console.log(self.state.menus);
            let len = data.length;
            //console.log("length: " + len);
            for (let i = 0; i < len; i++) {

                if (self.state.menusByCategory[data[i].menuCategory.name] == undefined) {
                    self.state.menusByCategory[data[i].menuCategory.name] = [];
                }
                //if (data[i].availability) {
                self.state.menusByCategory[data[i].menuCategory.name].push(data[i]);
                //}

            }

            await self.setState({ menusByCategory: self.state.menusByCategory });
            //console.log(self.state.menusByCategory);

        }).catch(function (error) {
            //console.log(error.response);
        });
    }

    toggleInfoModal() {
        this.setState({ isInfoOpen: !this.state.isInfoOpen })
    }

    async showMenuDetails(menuItem) {

        await this.setState({ menuItem: menuItem });
        this.toggleInfoModal();

    }

    async selectItem(menuItem) {

        let keys = Object.keys(this.state.selectedItems);
        if (!(keys.includes(menuItem.menuItemId.toString()))) {
            this.state.selectedItems[menuItem.menuItemId] = menuItem;
            this.state.selectedItems[menuItem.menuItemId]["itemAmmount"] = 1;
            this.state.selectedItems[menuItem.menuItemId]["instruction"] = "";
            await this.setState({ selectedItems: this.state.selectedItems });
        }
        else {
            this.state.selectedItems[menuItem.menuItemId]["itemAmmount"] = parseInt(this.state.selectedItems[menuItem.menuItemId]["itemAmmount"]) + 1;
            await this.setState({ selectedItems: this.state.selectedItems });
        }
        //console.log(this.state.selectedItems);
        localStorage.setItem('selectedItems', JSON.stringify(this.state.selectedItems));
        this.props.selectMenuItem(menuItem);
    }

    toggleModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    async getReviewes(menuItemId) {
        let self = this;
        await ReviewService.getReviewsByMenuItem(menuItemId).then(async function (resp) {
            //console.log(resp);
            await self.setState({ reviews: resp.data });
            if (resp.data.length > 0) {
                self.toggleModal();
            }
        }).catch(function (error) {
            console.log(error.response);
        });

    }




    render() {

        const InfoModal = () => {
            return (
                <Modal className={" rounded text-purple"} isOpen={this.state.isInfoOpen} toggle={this.toggleInfoModal} centered scrollable  >


                    <ModalHeader toggle={this.toggleInfoModal}>
                        <div className="h3">Details</div>
                    </ModalHeader>
                    <ModalBody className="text-center">
                        {
                            Object.keys(this.state.menuItem).length === 0 ? "" :
                                <>
                                    <p>{this.state.menuItem.description}</p>
                                    <h4 ><u>Allergens</u></h4>
                                    <p>{this.state.menuItem.allergens}</p>
                                </>
                        }
                    </ModalBody>

                </Modal>
            )
        }

        const ReviewModal = () => {
            return (
                <Modal className={" rounded text-purple"} toggle={this.toggleModal} isOpen={this.state.isOpen} centered scrollable   >


                    <ModalHeader className="shadow-custom" toggle={this.toggleModal}>
                        <div className="h3">Reviewes</div>
                    </ModalHeader>
                    <ModalBody style={{ overflowX: "hidden", overflowY: "auto" }}>

                        {
                            this.state.reviews.map((review, index) =>

                                <Row key={Math.random().toString(36).substring(0)}>

                                    <Col xs={12} className="d-flex align-content-center justify-content-center">
                                        <div className="rating">
                                            <input type="radio" id="star5" disabled checked={review.rate == 5} name={"rating" + index} value="5" /><label htmlFor="star5" >5 stars</label>
                                            <input type="radio" id="star4" disabled checked={review.rate == 4} name={"rating" + index} value="4" /><label htmlFor="star4" >4 stars</label>
                                            <input type="radio" id="star3" disabled checked={review.rate == 3} name={"rating" + index} value="3" /><label htmlFor="star3" >3 stars</label>
                                            <input type="radio" id="star2" disabled checked={review.rate == 2} name={"rating" + index} value="2" /><label htmlFor="star2" >2 stars</label>
                                            <input type="radio" id="star1" disabled checked={review.rate == 1} name={"rating" + index} value="1" /><label htmlFor="star1" >1 star</label>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <blockquote className="blockquote text-center">
                                            <p className="mb-0 font-weight-normal">{review.comment}</p>
                                            <footer className="blockquote-footer font-weight-light"><small>{review.reviewer + ", "}<cite>{(new Date(review.createdAt)).toLocaleString('en-US', { month: 'short', day: 'numeric', year: "numeric" })}</cite></small></footer>
                                        </blockquote>
                                    </Col>
                                </Row>
                            )

                        }
                    </ModalBody>

                </Modal>
            )
        }



        return (
            <>
                <div className="row mt-2">
                    <div className="col-12">
                        {this.state.menus.length < 1 ?
                            <div className="row">
                                <div className="col-12 h3">
                                    No menu items available
                                    
                                </div>
                            </div> :
                            <>


                                {
                                    Object.keys(this.state.menusByCategory).map((category, index) =>
                                        <div className="border mt-2 rounded" key={Math.random().toString(36).substring(0)}>
                                            <div className="row ml-1 mr-1 p-2">
                                                <div style={{ cursor: "pointer" }} id={"category" + category.split(" ").join("")} className="col-12 h3 mb-0 border text-purple rounded">
                                                    {category} 

                                                </div>
                                            </div>
                                            <UncontrolledCollapse defaultOpen toggler={"#category" + category.split(" ").join("")}>
                                                <Row className="mt-1 pl-1 pr-1 mr-1 ml-1 ">
                                                    {
                                                        this.state.menusByCategory[category].map((menu, index) => <Col key={Math.random().toString(36).substring(0)} xs={6} sm={4} lg={3} className="pl-1 pr-1 mb-2" >
                                                            <Card className="menuItemCard h-100">
                                                                <CardImg src={menu.imgPath} style={{ objectFit: "cover", height: "100%", width: '100%', maxHeight: '400px' }} />
                                                                <CardImgOverlay style={{ backgroundColor: 'rgba(255,255,255,.6)' }} className="p-1 d-flex flex-column align-content-center justify-content-center  text-center text-purple ">


                                                                    <h5> {menu.name}</h5>
                                                                    <h6> {menu.price}<FontAwesomeIcon icon={faEuroSign} /></h6>

                                                                    <div className="text-center custom  " >
                                                                        <Badge onClick={() => this.getReviewes(menu.menuItemId)} className="bg-purple btn " style={{ fontSize: '100%', cursor: 'pointer' }} >{parseFloat(menu.avgRate).toFixed(1)}<FontAwesomeIcon icon={faStar} />{"(" + menu.reviewCount + ")"}</Badge>
                                                                        {" "}
                                                                        <button onClick={() => this.showMenuDetails(menu)} id={"infoTooltip" + menu.menuItemId} className="btn btn-transparent p-0" ><FontAwesomeIcon className="text-purple" icon={faInfoCircle} size={"2x"} /></button>
                                                                        <UncontrolledTooltip placement="right" target={"infoTooltip" + menu.menuItemId}>
                                                                            Details
                                                                    </UncontrolledTooltip>
                                                                        <div >
                                                                            {!(localStorage.getItem('type') == 'admin' || localStorage.getItem('type') == 'waiter') && menu.availability &&
                                                                                <>
                                                                                    <button onClick={() => this.selectItem(menu)} id={"btnTooltip" + menu.menuItemId} className="btn  btn-block btn-sm btn-select btn-outline-primary font-weight-bold" >Select Item</button>
                                                                                    <UncontrolledTooltip placement="right" target={"btnTooltip" + menu.menuItemId}>
                                                                                        Add Item to order
                                                                                    </UncontrolledTooltip>
                                                                                </>
                                                                            }

                                                                        </div>


                                                                    </div>

                                                                </CardImgOverlay>
                                                            </Card>
                                                        </Col>
                                                        )
                                                    }
                                                </Row>
                                            </UncontrolledCollapse>

                                        </div>
                                    )
                                }
                            </>
                        }

                    </div>

                </div>
                <ReviewModal />
                <InfoModal />

            </>

        )
    }
}

//<FontAwesomeIcon icon={faCaretDown} size={"lg"} style={{ float: "right" }} /><FontAwesomeIcon icon={faCaretUp} size={"lg"} style={{ float: "right" }} /> line 211