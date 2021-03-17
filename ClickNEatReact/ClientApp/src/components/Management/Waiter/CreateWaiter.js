import { faEnvelope, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserR } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Form, Row, Alert } from 'reactstrap';
import WaiterService from '../../../services/WaiterService';




const CreateWaiter = (props) => {
    const [username, setUsername] = useState("");
    const [firstname, setFN] = useState("");
    const [lastname, setLN] = useState("");
    const [password, setPass] = useState("");
    const [conPass, setConPass] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [alertMsg, setAlert] = useState('');
    const [alertOpen, showAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        let user = {
            "username": username,
            "firstname": firstname,
            "lastname": lastname,
            "password": password,
            "phone": phone,
            "email": email
        };

        WaiterService.PostWaiter(user).then(function (resp) {
            window.location.reload(false);
        }).catch(function (error) {
            console.log(error.response);
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
                            <Form onSubmit={handleSubmit}>
                                <div className=" form-group row">
                                    <div className="col-12 col-sm-6">
                                        <div className="input-group">
                                            <span>

                                                <FontAwesomeIcon icon={faUser} />
                                                <input type="text"
                                                    defaultValue={username}
                                                    required
                                                    className="form-control"
                                                    placeholder={"Username"}
                                                    onChange={(e) => setUsername(e.target.value)}

                                                />

                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-sm-0 mt-3 col-sm-6">
                                        <div className="input-group">
                                            <span>

                                                <FontAwesomeIcon icon={faPhone} />
                                                <input type="tel"
                                                    defaultValue={phone}
                                                    required
                                                    pattern="[+]{0,1}[0-9]{9,15}"
                                                    title="Input a valid phone number"
                                                    className="form-control"
                                                    placeholder={"Phone no."}
                                                    onChange={(e) => setPhone(e.target.value)}

                                                />

                                            </span>
                                        </div>
                                    </div>


                                </div>
                                <div className=" form-group row">
                                    <div className="col-12 col-sm-6">
                                        <div className="input-group">
                                            <span>

                                                <FontAwesomeIcon icon={faUserR} />
                                                <input type="text"
                                                    defaultValue={firstname}
                                                    required
                                                    className="form-control"
                                                    placeholder={"First Name"}
                                                    onChange={(e) => setFN(e.target.value)}

                                                />

                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-sm-0 mt-3 col-sm-6">
                                        <div className="input-group">
                                            <span>

                                                <FontAwesomeIcon icon={faUserR} />
                                                <input type="text"
                                                    defaultValue={lastname}
                                                    required
                                                    className="form-control"
                                                    placeholder={"Last Name"}
                                                    onChange={(e) => setLN(e.target.value)}

                                                />

                                            </span>
                                        </div>
                                    </div>

                                    
                                </div>
                                
                                
                                <div className=" form-group row">
                                    <div className="col-12 col-sm-6">
                                        <div className="input-group">
                                            <span>

                                                <FontAwesomeIcon icon={faLock} />
                                                <input type="password"
                                                    defaultValue={password}
                                                    required
                                                    className="form-control"
                                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"
                                                    placeholder={"Password"}
                                                    onChange={(e) => setPass(e.target.value)}
                                                    title="[1]At least 1 Uppercase
[2]At least 1 Lowercase
[3]At least 1 Number
[4]At least 1 Symbol, symbol allowed --> !@#$%^&*_=+-
[5]Minimum 8 characters"
                                                />

                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-sm-0 mt-3 col-sm-6">
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


                                </div>
                                <div className=" form-group">

                                    <div className="input-group">
                                        <span>

                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <input type="email"
                                                defaultValue={email}
                                                required
                                                className="form-control"
                                                placeholder={"Email Address"}
                                                onChange={(e) => setEmail(e.target.value)}

                                            />

                                        </span>
                                    </div>
                                </div>
                                <div className=" form-group">
                                    <div className="custom">
                                        <button type={"submit"} disabled={!(password === conPass)} className="btn btn-block btn-outline-primary" >{"Register Waiter Account"}</button>
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

export default CreateWaiter;