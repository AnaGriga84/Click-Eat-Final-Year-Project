import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import CategoryServices from '../../../services/CategoryServices';
import CreateCategory from './CreateCategory';
import EditCategory from './EditCategory';

export default class Category extends Component
{

    constructor(props)
    {
        super(props)
        this.state = {
            mode: 'index',
            categories: [],
            category: {
                name: "",
                categoryId:-1,
            },
            isModalOpen:false

        }
        this.getCategories = this.getCategories.bind(this);
        this.ConfirmDelete = this.ConfirmDelete.bind(this);
        this.Delete = this.Delete.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
    }

    componentDidMount()
    {
        this.getCategories()
    }

    async getCategories() {
        let resp = await CategoryServices.getCategories().catch(function (error) {
            console.log(error.response);
        });
        if (resp !== undefined) {
            if (resp.status === 200) {
                console.log(resp.data);
                this.setState({ categories: resp.data })
            }
        }
    }

    async ConfirmDelete(category) {
        await this.setState({ category: category });
        this.setState({ isModalOpen: true });
    }
    async Delete(category) {

        CategoryServices.DeleteCategory(category.categoryId).then(function (resp) {
            console.log(resp);
            window.location.reload(false);
        }).catch(function (error) {
            console.log(error.response);
        });
        
    }

    async setEditMode(category) {
        await this.setState({ category: category });
        await this.setState({ mode: 'edit' });
    }


    render() {


        const ConfirmDelete = () => {
            return (
                <Modal returnFocusAfterClose={true} isOpen={this.state.isModalOpen} className="modal-dialog-centered" >
                    <ModalHeader className= "text-danger">
                        <FontAwesomeIcon  icon={faExclamationCircle} size={"lg"}/> Are you sure you want to delete this category?
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                ID: {this.state.category.categoryId}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Name: {this.state.category.name}
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.Delete(this.state.category)} className="btn  btn-danger">Yes</Button>
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

                            {this.state.categories.length < 1 ?
                                <div className="row">
                                    <div className="col-12 h3">
                                        No categories added yet
                                <Button className="btn btn-outline-success float-right" onClick={() => this.setState({ mode: 'create' })}>Create New Category</Button>
                                    </div>
                                </div> :
                                <>
                                <div className="row">
                                    <div className="col-12 h3">
                                        Categories
                                <Button className="btn btn-outline-success float-right" onClick={() => this.setState({ mode: 'create' })}>Create New Category</Button>
                                        
                                    </div>
                                    </div>
                
                                    {
                                        this.state.categories.map((category, index) =>
                                            <Row key={Math.random().toString(36).substring(0)} xs={12} className="mt-4">
                                                <Col xs={12}>
                                                    <Card className="shadow-sm">
                                                        <CardBody>
                                                            <Row>
                                                                <Col className="align-middle text-center" xs={12} sm={6} md={8}>
                                                                    <h4>{category.name}</h4>
                                                                </Col>
                                                                <Col xs={6} sm={3} md={2}>
                                                                    <Button onClick={() => this.setEditMode(category)} className = "btn btn-block btn-custom" > Edit</Button>
                                                                </Col>
                                                                <Col xs={6} sm={3} md={2}>
                                                                    <Button onClick={() => this.ConfirmDelete(category)} className="btn btn-block btn-danger">Delete</Button>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </>
                        }
                        </div>
                        <ConfirmDelete/>
                    </div>

                }
                {
                    this.state.mode === 'create' && <div>
                        <CreateCategory />
                    </div>
                }
                {
                    this.state.mode === 'edit' && <div>
                        <EditCategory category={this.state.category} />
                    </div>
                }
            </>

        )
    }

}