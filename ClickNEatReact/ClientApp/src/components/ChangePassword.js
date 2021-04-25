import { faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Alert, Col, Form, Row, Tooltip, ListGroup, ListGroupItem } from 'reactstrap';
import Auth from '../services/Auth';


const ChangePassword = (props) => {

    const [oldPass, setOldPass] = useState("");
    const [password, setPass] = useState("");
    const [conPass, setConPass] = useState("");
    const [alertMsg, setAlert] = useState('');
    const [alertOpen, showAlert] = useState(false);
    const [isTooltipOpen, showTooltip] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        let passwordData = {
            "oldPassword": oldPass,
            "newPassword": password,
            "confirmPassword": conPass
        };

        Auth.changePassword(passwordData).then(function (resp) {
            console.log(resp);
            alert(resp.data.title);
            localStorage.removeItem('username')
            localStorage.removeItem('type');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
            window.location.href = '/signin'
        }).catch(function (error) {
            console.log(error.response);
            setAlert(error.response.data.title);
            showAlert(true);
        })
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
                            <Form onSubmit={(e) => handleSubmit(e)}>
                                <div className=" form-group ">
                                    <div className="input-group">
                                        <span>

                                            <FontAwesomeIcon icon={faLock} />
                                            <input type="password"
                                                defaultValue={oldPass}
                                                required
                                                className="form-control"
                                                placeholder={"Current Password"}
                                                onChange={(e) => setOldPass(e.target.value)}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group ">
                                    <div className="input-group">
                                        <span>
                                            <FontAwesomeIcon icon={faLock} />
                                            <input type="password"
                                                defaultValue={password}
                                                required
                                                className="form-control password"
                                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
                                                placeholder={"New Password"}
                                                onChange={(e) => setPass(e.target.value)}
                                                title=" [1]At least 1 Uppercase
                                                        [2]At least 1 Lowercase
                                                        [3]At least 1 Number
                                                        [4]At least 1 Symbol, symbol allowed --> !@#$%^&*_=+-
                                                        [5]Minimum 8 characters"
                                            />
                                            <FontAwesomeIcon icon={faInfoCircle} size={'lg'} onClick={() => showTooltip(!isTooltipOpen)} href="#" id="passwordRequirement" />
                                            <Tooltip autohide={false} isOpen={isTooltipOpen} toggle={() => showTooltip(!isTooltipOpen)} placement="right" target="passwordRequirement">
                                                
                                                    At least 1 Uppercase, At least 1 Lowercase, At least 1 Number, At least 1 Symbol, symbol allowed !@#$%^&*_=+- and minimum 8 characters                                               
                                            </Tooltip>
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group ">
                                    <div className="input-group">
                                        <span>
                                            <FontAwesomeIcon icon={faLock} />
                                            <input type="password"
                                                defaultValue={conPass}
                                                required
                                                className="form-control"
                                                placeholder={"Confirm Password"}
                                                onChange={(e) => setConPass(e.target.value)}
                                                onBlur={(e) => {
                                                    if (password !== conPass) {
                                                        setAlert("Password doesn't match");
                                                        showAlert(true);
                                                    }
                                                    else {
                                                        setAlert("");
                                                        showAlert(false);
                                                    }
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">
                                    <div className="custom">
                                        <button type={"submit"} disabled={!(password === conPass && oldPass.length >= 8)} className="btn btn-block btn-outline-primary" >{"Change Password"}</button>
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
export default ChangePassword;