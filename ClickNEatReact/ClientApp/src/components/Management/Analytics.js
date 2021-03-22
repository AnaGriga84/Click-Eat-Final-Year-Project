//import { extend } from 'jquery'
import { faEuroSign, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Col, Row } from 'reactstrap';
import PaymentService from '../../services/PaymentService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
//import $ from 'jquery';


class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sales: [],
            total: 0
        }
        this.getSales = this.getSales.bind(this);
        this.printAsPdf = this.printAsPdf.bind(this);
        this.dataURItoBlob = this.dataURItoBlob.bind(this);
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

    dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob,  done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString });


    }

    printAsPdf() {
        html2canvas(document.querySelector("#printableReport")).then(canvas => {
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const pageNo = parseInt(Math.ceil(pdfHeight / height));
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth / pageNo, (height < pdfHeight ? height : pdfHeight));
            pdf.save("download.pdf");
        });


    }

    render() {
        return (

            <div>
                <Row className="pt-3 pb-2 border-bottom">
                    <Col className="text-right">
                        <button onClick={this.printAsPdf} className="btn btn-danger btn-sm"><FontAwesomeIcon icon={faPrint} /> Print</button>
                    </Col>
                </Row>
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
                <Row id="printableReport" className="pt-3 pb-2 border-bottom overflow-auto">
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