import { faCalendarAlt, faCreditCard, faEuroSign, faInfoCircle, faShieldAlt, faUser, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SelectedItem from '../MenuItem/selectedItem';
import { formatCreditCardNumber, formatCVC, formatExpirationDate, formatFormData } from '../../../util/utils'
import PaymentService from '../../../services/PaymentService';
import OrderService from '../../../services/OrderService';
import $ from 'jquery';
import BraintreeService from '../../../services/BraintreeService';

const DuePayment = (props) => {

    const [order, setOrder] = useState(props.order);
    const [cardHolderName, setCardHolder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardCVC, setCardCVC] = useState("");
    const [cardExpireDate, setExpireDate] = useState("");
    const [isOpen, toggleModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState("");
    const [token, setToken] = useState(props.order.token);
    const [dData, setDeviceData] = useState(null);

    useEffect(() => {

        renderForm();
    }, [])

    const renderForm = async () => {
        var authToken = token;
        var form = document.querySelector('#paymentForm');
        var submit = document.querySelector('input[type="submit"]');


        async function getDeviceData(err, dataCollectorInstance) {
            if (err) {
                // Handle error in creation of data collector
                return;
            }
            // At this point, you should access the dataCollectorInstance.deviceData value and provide it
            // to your server, e.g. by injecting it into your form as a hidden input.
            var deviceData = dataCollectorInstance.deviceData;


            window.braintree.client.create({
                authorization: authToken,
            }, function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }

                // This example shows Hosted Fields, but you can also use this
                // client instance to create additional components here, such as
                // PayPal or Data Collector.

                window.braintree.hostedFields.create({
                    client: clientInstance,
                    styles: {
                        'input': {
                            'font-size': '14px'
                        },
                        'input.invalid': {
                            'color': 'red'
                        },
                        'input.valid': {
                            'color': 'green'
                        }
                    },
                    fields: {
                        cardholderName: {
                            selector: '#cc-name',
                            placeholder: 'Name as it appears on your card'
                        },
                        number: {
                            selector: '#card-number',
                            placeholder: '4111 1111 1111 1111'
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: '123'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: '10/2022'
                        },
                        postalCode: {
                            selector: '#postal-code',
                            placeholder: '10001'
                        }
                    }
                },


                    function (hostedFieldsErr, hostedFieldsInstance) {
                        if (hostedFieldsErr) {
                            console.error(hostedFieldsErr);
                            return;
                        }

                        submit.removeAttribute('disabled');

                        form.addEventListener('submit', function (event) {
                            event.preventDefault();

                            var formIsInvalid = false;
                            var state = hostedFieldsInstance.getState();


                            // Loop through the Hosted Fields and check
                            // for validity, apply the is-invalid class
                            // to the field container if invalid
                            Object.keys(state.fields).forEach(function (field) {
                                if (!state.fields[field].isValid) {
                                    $(state.fields[field].container).addClass('is-invalid');
                                    formIsInvalid = true;
                                }
                            });

                            if (formIsInvalid) {
                                // skip tokenization request if any fields are invalid
                                alert("Card input is not valid");
                                return;
                            }




                            hostedFieldsInstance.tokenize({
                                cardholderName: $('#cc-name').val()
                            },

                                function (tokenizeErr, payload) {
                                    if (tokenizeErr) {
                                        console.error(tokenizeErr);
                                        return;
                                    }

                                    console.log(deviceData);
                                    // If this was a real integration, this is where you would
                                    // send the nonce to your server.
                                    console.log('Got a nonce: ' + payload.nonce);

                                    BraintreeService.payment({
                                        "correlation_id": JSON.parse(deviceData).correlation_id,
                                        "nonce": payload.nonce,
                                        "ammount": order.total
                                    }).then(function (resp) {
                                        console.log(resp.data);
                                        var result = resp.data.result;
                                        makePayment(result);


                                    }).catch(function (error) {
                                        alert("Transaction failed");
                                        console.log(error.response);
                                    })

                                });
                        }, false);
                    });
            });


        }

        await window.braintree.client.create({
            authorization: authToken
        }, async function (err, clientInstance) {
            // Creation of any other components...

            await window.braintree.dataCollector.create({
                client: clientInstance,
                hostedFields: true
            }, (err, dataCollectorInstance) => getDeviceData(err, dataCollectorInstance));
        });




    }


    const handleInputChange = (event) => {

        if (event.target.name === "number") {
            event.target.value = formatCreditCardNumber(event.target.value);
            setCardNumber(event.target.value);
        } else if (event.target.name === "expiry") {
            event.target.value = formatExpirationDate(event.target.value);
            setExpireDate(event.target.value)
        } else if (event.target.name === "cvc") {
            event.target.value = formatCVC(event.target.value);
            setCardCVC(event.target.value);
        }

        //this.setState({ [target.name]: target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        toggleModal(true);
    }

    const makePayment = (result) => {

        toggleModal(false);
       
        //console.log(selectedItems);
        //console.log(cardNumber.split(" ").join(""));
        //console.log(cardCVC);
        //console.log(cardExpireDate);

        
        var card = result.target.creditCard;
        let payData = {
            "cardHolderName": card.cardholderName,
            "amount": parseFloat(order.total),
            "cardNumber": card.maskedNumber,
            "expireDate": card.expirationDate,
            "cvv": cardCVC,
            "orderId": order.orderId,
            "order": order
        }

        console.log(payData);
        PaymentService.insertDuePayment(payData).then(function (resp) {
            console.log(resp);
            setMsg(<><div>Payement Success!!</div>
                <div><a href="/" className="text-decoration-none text-purple font-weight-bold">Go back to menu items</a></div></>);
            setVisible(true);
            localStorage.removeItem("pendingPayment");
            

        }).catch(function (error) {
            console.log(error.response);
        });

    }


    const ConfirmModal = () => {
        return (
            <Modal className={" rounded text-purple"} isOpen={isOpen} centered scrollable backdrop="static"  >
                <div className="shadow-custom">

                    <ModalHeader toggle={() => toggleModal(!isOpen)}>
                        <div className="h3">Confirm Payment</div>
                    </ModalHeader>
                    <ModalBody>
                        <em>Total: </em>{order.total}<FontAwesomeIcon icon={faEuroSign} /><br />
                        <em>Number: </em>{cardNumber}<br />
                        <em>Name: </em>{cardHolderName}<br />
                        <em>Expiry: </em>{cardExpireDate}<br />
                        <em>CVC: </em>{cardCVC}
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <button onClick={() => makePayment()} className="btn btn-custom" >Pay</button>
                    </ModalFooter>
                </div>
            </Modal>
        )
    }

    const SuccessModal = () => {
        return (
            <Modal className={" rounded text-purple"} isOpen={visible} centered scrollable backdrop="static"  >
                <div className="shadow-custom">


                    <ModalBody>
                        <Alert color="info" className="text-center" isOpen={visible} toggle={() => window.location.reload(false)}>
                            {msg}
                        </Alert>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <button onClick={() => window.location.reload(false)} className="btn btn-custom" >OK</button>
                    </ModalFooter>
                </div>
            </Modal>
        )
    }


    return (

        <>  

            <div className='demo-frame'>
               

                <form id="paymentForm" method="post">
                    <label className="hosted-fields--label" ><FontAwesomeIcon icon={faInfoCircle} size={"sm"} /> If any field is inaccessible press on field label to access it.</label>
                    <label className="hosted-fields--label" htmlFor="ammount">Ammount Total</label>
                    <div className="hosted-field " style={{ paddingTop:'5px' }} id="ammount">
                        {order.total}<FontAwesomeIcon icon={faEuroSign} />
                    </div>
                    <label className="hosted-fields--label" style={{ cursor: "pointer" }} htmlFor="cc-name">Card Holder Name</label>
                    <div className="hosted-field" id="cc-name"></div>
                    <label className="hosted-fields--label" style={{ cursor: "pointer" }} htmlFor="card-number">Card Number</label>
                    <div className="hosted-field" id="card-number"></div>

                    <label className="hosted-fields--label" style={{ cursor: "pointer" }} htmlFor="cvv">CVV</label>
                    <div className="hosted-field" id="cvv"></div>

                    <label className="hosted-fields--label" style={{ cursor: "pointer" }} htmlFor="expiration-date">Expiration Date</label>
                    <div className="hosted-field" id="expiration-date"></div>
                    <label className="hosted-fields--label" style={{ cursor: "pointer" }} htmlFor="postal-code">Postal Code</label>
                    <div className="hosted-field" id="postal-code"></div>
                    <div className="text-center custom">
                        <input type="submit" value="Pay" className="btn btn-outline-primary" />
                    </div>
                </form>

                <ConfirmModal />
                <SuccessModal />
            </div>
        </>

    )

}

export default DuePayment;