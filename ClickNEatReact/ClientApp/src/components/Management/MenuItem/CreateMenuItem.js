import { faAlignJustify, faAllergies, faBiohazard, faDrumstickBite, faEuroSign, faImage, faSeedling, faTag, faUser, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, useEffect, useState } from 'react';
import { Alert, Card, CardBody, CardHeader, Col, Form, Row, Button, ButtonGroup } from 'reactstrap';
import CategoryServices from '../../../services/CategoryServices';
import MenuItemService from '../../../services/MenuItemService';
import { FaUtensilSpoon, MdShortText } from 'react-icons/all';
import FileService from '../../../services/FileService';



function CreateMenuItem(props) {
    const [alertOpen, showAlert] = useState(false);
    const [alertMsg, setAlert] = useState('');
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [price, setPrice] = useState("");
    const [imgPath, setImgPath] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [allergens, setAllergens] = useState('');
    const [imgFile, setImgeFile] = useState(null);
    const [availability, setAvailability] = useState(true);
    const [isVegan, setVegan] = useState(false);

    useEffect(() => {
        if (categories.length <= 0) {
            CategoryServices.getCategories().then(function (resp) {
                console.log(resp);
                setCategories(resp.data);
            }).catch(function (error) {
                console.log(error.response);
            });
        }
    });

    const validate = () => {
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let menuItem = {
            "name": name,
            "description": description,
            "price": price,
            "imgPath": imgPath,
            "availability": availability,
            "categoryId": categoryId,
            "allergens": allergens,
            "isVegan": isVegan
        }

        MenuItemService.insertMenuItem(menuItem).then(function (resp) {
            console.log(resp)
            window.location.reload(false);
        }).catch(function (error) {
            console.log(error.response);
        });     
    }

    const processFile = (e) => {
        setImgeFile(e.target.files[0]);
        FileService.postImage(e.target.files[0]).then(function (resp) {
            console.log(resp)
            setImgPath(resp.data.url)
        }).catch(function (error) {
            console.log(error.response);
        });
    }

    return (

        <div>
            <Row className="text-purple mt-3">
                <Col xs="12" sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }}>
                    <Card className="shadow-custom">
                        <CardHeader>
                            <Alert aria-live="polite" className="text-center " color="danger" isOpen={alertOpen} toggle={() => showAlert(false)}>
                                {alertMsg}
                            </Alert>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>

                                            <FontAwesomeIcon icon={faDrumstickBite} />
                                            <input type="text"
                                                defaultValue={name}
                                                required
                                                className="form-control"
                                                placeholder={"Name"}

                                                onChange={(e) => setName(e.target.value)}
                                            />

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">
                                    
                                    <div className="input-group">
                                        <span className="align-items-start">

                                            <FontAwesomeIcon icon={faAlignJustify} className="mt-2" />
                                            <textarea type="text"
                                                defaultValue={description}
                                                required
                                                className="form-control"
                                                placeholder={"Description"}
                                                onChange={(e) => setDesc(e.target.value)}

                                            ></textarea>

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>

                                            <FontAwesomeIcon icon={faEuroSign} />
                                            <input type="number"
                                                defaultValue={price}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="form-control "
                                                placeholder={"Price"}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className="from-group">
                                    <div>
                                        <div className=" w-100 text-center">
                                            <label htmlFor={"img3"} className="w-100">
                                                <div id={"input-div"}
                                                    className={imgPath.length > 0 ? "d-none text-purple rounded square align-middle" : " text-purple rounded square align-middle"}>
                                                    <FontAwesomeIcon icon={faImage} size={"lg"} />
                                                    <p className=" small circle-p text-dark">Upload Image</p>
                                                </div>

                                                <div className={imgPath.length > 0 ? "d-flex justify-content-center align-items-center" :"d-none  justify-content-center align-items-centerz" } >
                                                    <img src={imgPath.length > 0 ? imgPath : ""} className={imgPath.length > 0 ? " rounded d-block" : "d-none rounded"}
                                                        style={{ height: '200px',width: '100%', objectFit: "cover" }}
                                                    />
                                                </div>
                                                
                                            </label>
                                            <input type='file' required onChange={processFile} className="d-none"
                                                id={"img3"} accept={"image/*"} />

                                        </div>
                                    </div>
                                </div>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>
                                            <FontAwesomeIcon icon={faUtensils}/>

                                            <ButtonGroup required className={"custom btn-block mr-2 ml-2 rounded"}>
                                                <Button role="radio" className="btn btn-outline-primary border" onClick={() => setAvailability(false)} active={availability === false}>Not Available</Button>
                                                <Button role="radio" className="btn btn-outline-primary border" onClick={() => setAvailability(true)} active={availability === true}>Available</Button>
                                                
                                            </ButtonGroup>

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>
                                            <FontAwesomeIcon icon={faSeedling} />

                                            <ButtonGroup required className={"custom btn-block mr-2 ml-2 rounded"}>
                                                <Button role="radio" className="btn btn-outline-primary border" onClick={() => setVegan(false)} active={isVegan === false}>Non Veg</Button>
                                                <Button role="radio" className="btn btn-outline-primary border" onClick={() => setVegan(true)} active={isVegan === true}>Veg</Button>

                                            </ButtonGroup>

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>

                                            <FontAwesomeIcon icon={faBiohazard} />
                                            <input type="text"
                                                defaultValue={allergens}
                                                required
                                                className="form-control"
                                                placeholder={"Allergens"}

                                                onChange={(e) => setAllergens(e.target.value)}
                                            />

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>
                                            <FontAwesomeIcon icon={faTag} />

                                            <select onChange={(e) => setCategoryId(e.target.value)} defaultValue={categoryId} required class="form-control text-purple">
                                                <option value="">Select Category</option>
                                                {
                                                    categories.map((category) =>
                                                        <option value={category.categoryId}>{category.name}</option>
                                                        )
                                                }
                                            </select>

                                        </span>
                                    </div>
                                </div>
                                
                                <div className=" form-group">
                                    <div className="custom">
                                        <button type={"submit"} disabled={!(name.trim().length > 0
                                            && description.trim().length > 0
                                            && (price != 0 && price != "")
                                            && imgPath.trim().length > 0
                                            && categoryId != ""
                                            && allergens.trim().length > 0)} className="btn btn-block btn-outline-primary" >{"Save Menu Item"}</button>                                      
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

export default CreateMenuItem;