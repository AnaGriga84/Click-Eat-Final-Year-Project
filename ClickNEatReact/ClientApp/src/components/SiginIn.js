import React, { Component } from 'react';
import { Alert, Form, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import "../Assets/Style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAddressBook, faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import Auth from '../services/Auth';
import { error } from 'jquery';



export class SignIn extends Component {
    static displayName = SignIn.name;

    constructor(props) {
        super(props);
        this.state = {
            alertMsg: "",
            alertOpen: false,
            username: "",
            password:"",
        }
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    validate() {
        return (this.username.length > 0 &&
            this.props.length > 0);
    }

    async handleSubmit(e) {
        e.preventDefault();
        let user = {
            username: this.state.username,
            password: this.state.password
        }
        let self = this;
        let resp = await Auth.verifyUser(user).catch(function (error) {
            error = error.response.data;
            self.setState({ alertMsg: error.title });
            self.setState({ alertOpen: true });
        });
        if (resp !== undefined) {
            //console.log(resp);
            if (resp.status === 200) {
                let data = resp.data;
                localStorage.setItem('username', data.username)
                localStorage.setItem('type', data.type.toLowerCase());
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userId', data.userId)
                localStorage.setItem('token', data.token)

                //console.log(JSON.parse(atob(data.token.split('.')[1])));
                this.props.setType(data.type);
                this.props.setLoggedIn(true);
                //console.log(this);
                if (data.type.toLowerCase() === 'admin') {
                    window.location.href = '/Analytics';
                }
                else if (data.type.toLowerCase() === 'waiter') {
                    window.location.href = '/Analytics';
                }
                else {
                    window.location.href = '/'
                }
            }
        }
            
        
        
    }


    render() {
        return (
            <>
                <Row  className="text-purple mt-5">
                    <Col xs="12" sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }}>
                        <Card className="shadow-custom">
                            <CardHeader>
                                <Alert aria-live="polite" className="text-center " color="danger" isOpen={this.state.alertOpen} toggle={() => this.setState({ alertOpen: false })}>
                                    {this.state.alertMsg}
                                </Alert>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.handleSubmit}>
                                    <div className=" form-group">

                                        <div className="input-group">
                                            <span>

                                                <FontAwesomeIcon icon={faUser} />
                                                <input type="text"
                                                    defaultValue={this.state.username}
                                                    required
                                                    className="form-control"
                                                    placeholder={"Username"}
                                                    onChange={(e) => this.setState({ username: e.target.value })}

                                                />

                                            </span>
                                        </div>
                                    </div>
                                    <div className=" form-group">

                                        <div className="input-group">
                                            <span>
                                                <FontAwesomeIcon icon={faLock} />

                                                <input
                                                    defaultValue={this.state.password}
                                                    type="password"
                                                    required
                                                    className="form-control"
                                                    placeholder={"Password"}
                                                    onChange={(e) => this.setState({ password: e.target.value })}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className=" form-group">
                                        <div className="custom">
                                            <button type={"submit"} disabled={!(this.state.username.length > 0 &&
                                                this.state.password.length > 0)} className="btn btn-block btn-outline-primary" >{"Join In"}</button>
                                        </div>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                        
                        
                    </Col>
                </Row>
            </>
        );
    }
}



