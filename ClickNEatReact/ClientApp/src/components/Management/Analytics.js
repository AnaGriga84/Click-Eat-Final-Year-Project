//import { extend } from 'jquery'
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Col, Row } from 'reactstrap';
import PaymentService from '../../services/PaymentService';
//import $ from 'jquery';


class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sales: [],
            total: 0
        }
        this.getSales = this.getSales.bind(this);
    }
    componentDidMount() {
        this.getSales("1");
    }

    getSales(period) {
        //period = $('#salesPeriods').val();
        let self = this;
        PaymentService.getSalesByPeriod(period).then(async function (resp) {
            console.log(resp.data);
            await self.setState({
                sales: resp.data
            });
            let total = 0;
            for (let i = 0; i < resp.data.length; i++) {
                total += resp.data[i].amount;

            }
            await self.setState({ total: total });
        }).catch(function (error) {

        })
    }

    render() {
        return (

            <div>
                <Row className="pt-3 pb-2 border-bottom">
                    <Col xs={6}><h4>Sales</h4></Col>
                    <Col xs={6}>
                        <div>
                            <select  defaultValue="1" onChange={(e) => this.getSales(e.target.value)} className="form-control">
                                <option value="1">Today's sales</option>
                                <option value="7">Last 7 day's sales</option>
                                <option value="30">Last 30 days's sales</option>
                                <option value="year">This years's sales</option>
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row className="pt-3 pb-2 border-bottom overflow-auto">
                    <Col>
                        <table className="table  text-center text-purple table-striped">
                            <thead >
                                <tr >
                                    <th className="font-weight-bold">Item</th>
                                    <th className="font-weight-bold">Category</th>
                                    <th className="font-weight-bold">Total</th>
                                    <th className="font-weight-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody >

                                {
                                    this.state.sales.map(sale =>
                                        < >
                                            {
                                                sale.order.orderItems.map(orderItem =>
                                                    <tr  key={orderItem.orderItemId}>

                                                        <td className="font-weight-normal">{orderItem.menuItem.name}</td>
                                                        <td className="font-weight-normal">{orderItem.menuItem.menuCategory.name}</td>
                                                        <td className="font-weight-normal"><FontAwesomeIcon icon={faEuroSign} /> {orderItem.itemAmmount * orderItem.price}</td>
                                                        <td className="font-weight-normal">{sale.order.status}</td>
                                                    </tr>
                                                )
                                            }
                                        </>
                                    )
                                }
                                <tr>
                                    <td colSpan="2" className="font-weight-bold text-right">Total sales:</td>
                                    <td className="font-weight-bold"><FontAwesomeIcon icon={faEuroSign} /> {this.state.total}</td>
                                    <td className="font-weight-normal"></td>
                                </tr>

                            </tbody>
                        </table>
                    </Col>
                </Row>

            </div>


        );
    }

}
export default Analytics;