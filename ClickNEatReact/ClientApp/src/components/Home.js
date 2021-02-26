import { faEuroSign, faPlusCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Card, CardBody, CardImg, Col, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Row, UncontrolledTooltip, CardImgOverlay, Badge } from 'reactstrap';
import MenuItemService from '../services/MenuItemService';
import ReviewService from '../services/ReviewService';
import SelectedItem from './Shop/MenuItem/selectedItem';
import './Shop/Review/StarRating.css'


export class Home extends Component {
    static displayName = Home.name; constructor(props) {
        super(props)

        this.state = {
            menus: [],
            selectedItems: {},
            reviews: [],
            menusByCategory: {},
            isOpen: false,



        }

        this.getMenuItems = this.getMenuItems.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getReviewes = this.getReviewes.bind(this);


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

    async selectItem(menuItem) {

        let keys = Object.keys(this.state.selectedItems);
        if (!(keys.includes(menuItem.menuItemId.toString()))) {
            this.state.selectedItems[menuItem.menuItemId] = menuItem;
            this.state.selectedItems[menuItem.menuItemId]["itemAmmount"] = 1;
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
        }).catch(function (error) {
            console.log(error.response);
        });
        this.toggleModal();
    }




    render() {


        const ReviewModal = () => {
            return (
                <Modal className={" rounded text-purple"} isOpen={this.state.isOpen} centered scrollable backdrop="static"  >
                    <div className="shadow-custom">

                        <ModalHeader toggle={this.toggleModal}>
                            <div className="h3">Reviewes</div>
                        </ModalHeader>
                        <ModalBody>
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
                                            <blockquote class="blockquote text-center">
                                                <p class="mb-0 font-weight-normal">{review.comment}</p>
                                                <footer class="blockquote-footer font-weight-light"><small>{review.reviewer + ", "}<cite>{(new Date(review.createdAt)).toLocaleString('en-US', { month: 'short', day: 'numeric', year: "numeric" })}</cite></small></footer>
                                            </blockquote>
                                        </Col>
                                    </Row>
                                )

                            }
                        </ModalBody>
                    </div>
                </Modal>
            )
        }



        return (
            <>
                <div className="row mt-4">
                    <div className="col-12">
                        {this.state.menus.length < 1 ?
                            <div className="row">
                                <div className="col-12 h3">
                                    No menu items available
                                    
                                </div>
                            </div> :
                            <>


                                {
                                    Object.keys(this.state.menusByCategory).map((category) =>
                                        <div key={Math.random().toString(36).substring(0)}>
                                            <div className="row mt-4">
                                                <div className="col-12 h3">
                                                    {category}

                                                </div>
                                            </div>
                                            <Row className="mt-2">
                                                {
                                                    this.state.menusByCategory[category].map((menu, index) => <Col key={Math.random().toString(36).substring(0)} xs={12} sm={4} lg={3} className=" mb-4" >
                                                        <Card className="menuItemCard h-100">
                                                            <CardImg src={menu.imgPath} style={{ objectFit: "cover", height: "100%", width: '100%' }} />
                                                            <CardImgOverlay style={{ backgroundColor: 'rgba(255,255,255,.6)' }} className="pb-2 d-flex flex-column align-content-center justify-content-center  text-center text-purple ">


                                                                <h5> {menu.name}</h5>
                                                                <h6> {menu.price}<FontAwesomeIcon icon={faEuroSign} /></h6>
                                                                <p className=" font-weight-normal p-0 m-0"> {menu.description}</p>
                                                                <p className="font-weight-normal p-0 m-0"><em>Allergens:</em> {menu.allergens}</p>
                                                                <div className="text-center  " >

                                                                    {!(localStorage.getItem('type') == 'admin' || localStorage.getItem('type') == 'waiter') && menu.availability &&
                                                                        <>
                                                                            <button onClick={() => this.selectItem(menu)} id={"btnTooltip" + menu.menuItemId} className="btn btn-transparent p-0" ><FontAwesomeIcon className="text-purple" icon={faPlusCircle} size={"2x"} /></button>
                                                                            <UncontrolledTooltip placement="right" target={"btnTooltip" + menu.menuItemId}>
                                                                                Add Item to your order
                                                                                </UncontrolledTooltip>

                                                                        </>
                                                                    }
                                                                    {" "}<Badge onClick={() => this.getReviewes(menu.menuItemId)} className="bg-purple btn " style={{ fontSize: '100%', cursor: 'pointer' }} >{menu.avgRate}<FontAwesomeIcon icon={faStar} />{"(" + menu.reviewCount + ")"}</Badge>

                                                                </div>

                                                            </CardImgOverlay>

                                                        </Card>
                                                    </Col>


                                                    )
                                                }
                                            </Row>

                                        </div>
                                    )
                                }
                            </>
                        }

                    </div>

                </div>
                <ReviewModal />

            </>

        )
    }
}
