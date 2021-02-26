import { faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, useState } from 'react';
import { Alert, Card, CardBody, CardHeader, Col, Form, Row } from 'reactstrap';
import CategoryServices from '../../../services/CategoryServices';



function EditCategory(props) {
    const [category, SetCategory] = useState(props.category.name);
    const [alertOpen, showAlert] = useState(false);
    const [alertMsg, setAlert] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (category.trim().length > 0) {
            props.category.name = category;
            CategoryServices.updateCategory(props.category).then(function (resp) {
                console.log(resp);
                window.location.reload(false);
            }).catch(function (error) {

                console.log(error.response);
                setAlert(JSON.stringify(error.response.data.title));
                showAlert(true);
            });
        }
    }

    return (

        <div>
            <Row className="text-purple mt-5">
                <Col xs="12" sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }}>
                    <Card className="shadow-custom">
                        <CardHeader>
                            <Alert aria-live="polite" className="text-center " color="danger" isOpen={alertOpen} toggle={() => showAlert(false)}>
                                {alertMsg}
                            </Alert>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                Category ID: {props.category.categoryId} 
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>

                                            <FontAwesomeIcon icon={faTag} />
                                            <input type="text"
                                                defaultValue={category}
                                                required
                                                className="form-control"
                                                placeholder={"Category Name"}
                                                onChange={(e) => SetCategory(e.target.value)}

                                            />

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">
                                    <div className="custom">
                                        <button type={"submit"} disabled={!(category.trim().length > 0)} className="btn btn-block btn-outline-primary" >{"Save Category"}</button>
                                    </div>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>


                </Col>
            </Row>
        </div>

    )
}

export default EditCategory;