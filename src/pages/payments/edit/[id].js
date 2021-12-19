import * as React from 'react';
import {Button, Row, Col, Card, Form, InputGroup, FormControl, Modal, Tabs, Tab, Alert, Table} from 'react-bootstrap';
import DataTable, { createTheme } from 'react-data-table-component';
import Layout from '../../../components/Layout';
import {connect} from 'react-redux'
import Router from "next/router";
import {toast} from 'react-toastify'
import {alertSuccess, alertDanger} from '../../../components/alert'
import { getUser } from "../../../redux/actions/user";
import { updatePayment, showPayment } from "../../../redux/actions/payment";

class index extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            modalProduct: false,
            columns: [
                {
                    name: 'ID',
                    selector: (row, index) =>  ((index+1) + (this.state.page - 1) * this.state.num) + '.',
                    sortable: true,
                    width: '10%'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                },
                {
                    name: 'Actions',
                    selector: (row, index) => (<div style={{ color:'green' }}><i style={{ color:'#FFF', borderRadius:'50%', background:'green', padding:'2px' }} className="fa fa-plus" onClick={ () => {
                        let keranjang = this.state.keranjang
                        // row.attributes.amount = Number(row.attributes.amount)
                        row.percent = 0
                        row.wage_price = 0       
                        keranjang.push(row)
                        this.setState({
                            keranjang: keranjang
                        })
                        let delete_data = [...this.state.data]
                        delete_data.splice(index, 1)
                        this.setState({
                            data: delete_data
                        })
                        alertSuccess('items added!')
                        
                    }}></i> Add</div>),
                    width: '10%'
                }
            ],
            data: [],
            dataDetail: null,
            keranjang: [],
            total: 0,
            bonus: '',
            name: null, 
            date:'',
            page: 1,
            num: 5,
            total_items: 0,
            dataSearch: null,
            modalShow: false,
            modalOrder: false,
            wages:[],
            includeProduct: null,
            search_item: '',
            total_percent: 0

        }
    }

    getTotalPercents = (data) => {
        let total = 0;
        data.forEach(item => {
          total += item.percent;
        });

        this.state.total_percent = total
        return parseFloat(total);
    };

    addEmployee = async () => {
        this.setState({ modalProduct:true })
    }
    searchItem = async () => {
        this.getData(1, this.state.num)
    }

    getData = (page, size = this.state.num) => {
        let payload = {
            page: page,
            limit: size,
        }
        this.props.getUser(payload).then(() => {
            this.setState({
                data: this.props.dataUser,
            })
        })
    }
    handlePageChange = page => {
        this.getData(page)
    }

    handlePerRowsChange = async (newPerPage, page) => {
        this.getData(page, newPerPage);
    };

    async componentDidMount() {
        this.props.showPayment(Router.router.query.id, {}).then(() => {
            let total_before = 0
            this.props.data.data.wage.forEach(item => {
                item.percent = item.percentage
                item.wage_price = item.wage_price
                item.user.name = item.user.name
                total_before += parseFloat(item.percentage) 
            });
            this.setState({
                keranjang: this.props.data.data.wage,
                name: this.props.data.data.name,
                bonus: this.props.data.data.bonus,
                date: this.props.data.data.created_at,
                total_percent: total_before
            })
        })
    }

    savePayment = (e) => {
        if(this.state.total_percent > 0 && (this.state.total_percent > 100 || this.state.total_percent < 100)){
            toast.error("Percent must be in 100 %", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            })
        }
        let items = []
        this.state.keranjang.forEach(item => {
            items.push({
                user_id: item.user.id,
                percentage: item.percent,
                wage_price: item.wage_price
            })
        });
        
        let payload = {
            name: this.state.name,
            bonus:this.state.bonus,
            wages: items
        }
        
        this.props.updatePayment(Router.router.query.id, payload).then(() => {
            Router.replace("/payments");
            alertSuccess('Payment updated')
        })
    }

    submitCheckOut = () => {
        this.savePayment()
    }
  
    render () {
  
      return (
        
        <Layout title="Edit Payment" classname="dashboard theme-light">
            <Modal 
                show={this.state.modalProduct} 
                onHide={() => this.setState({ modalProduct: false })}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton style={{ border:'none'}}>
                    <Modal.Title>Add Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        style={{justifyContent: 'left'}}
                        defaultActiveKey="products" transition={false} id="noanim-tab-example"
                    >
                        <Tab eventKey="products" title="Data">
                            <Row className="mt-5">
                                <Col xs={12}>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Col sm="5">
                                        <Form.Control type="text" placeholder="Cari Item" defaultValue={this.state.search_item} onChange={(e) => this.setState({search_item: e.target.value})} />
                                    </Col>
                                    <Col sm="2">
                                        <Button onClick={this.searchItem} variant="success" style={{ width: '100%' }} size="sm"><i className="fa fa-search"></i> Cari Item</Button>
                                    </Col>
                                </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <DataTable
                                        noHeader
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        highlightOnHover
                                        paginationTotalRows={this.state.total_items}
                                        paginationPerPage={this.state.num}
                                        pagination
                                        paginationServer
                                        onChangePage={this.handlePageChange}
                                        onChangeRowsPerPage={this.handlePerRowsChange}
                                    />
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer style={{ border:'none'}}>
                <Button variant="success" onClick={() => this.setState({ modalProduct: false })}>
                    FINISH
                </Button>
                </Modal.Footer>
            </Modal>
            <Card style={{ backgroundColor: 'white', borderRadius:'10px' }} >
                <div className="mb-5">
                    <Form className="m-5">
                        <Row>
                            <Col xs={6}>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">
                                        Transaction Name
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="text" placeholder="Transaction Name" defaultValue={this.state.name}  onChange={(e) => this.setState({ name: e.target.value })} />
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col xs={6}>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">
                                    Bonus
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control type="text" defaultValue={this.state.bonus} onChange={(e) => this.setState({ bonus: e.target.value })} />
                                    </Col>
                                    
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <Table size="lg" className="mb-5 table-size" responsive>
                        <thead>
                            <tr>
                                <th className="pl-5">No</th>
                                <th>Employee Name</th>
                                <th>Percent (%)</th>
                                <th>Price (IDR)</th>
                                <th className="pr-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.keranjang.map((r, index) => (
                                <tr key={index}>
                                    <td className="pl-5">{index+1}</td>
                                    <td>
                                        {r.user.name}
                                    </td>

                                    <td><Form.Control type="number" max="100" defaultValue={r.percentage} 
                                    onChange={(e) => {
                                        let items = [...this.state.keranjang];
                                        let item = {...items[index]};
                                        let attributes = {...item}
                                        let total_harga = (this.state.bonus * e.target.value)/100
                                        attributes.wage_price = total_harga
                                        attributes.percent = e.target.value
                                        items[index] = attributes;
                                        this.setState({
                                            keranjang: items,
                                        })
                                    }} 
                                    />
                                    </td>
                                    <td>{ r.wage_price }</td>
                                    <td className="pr-5">
                                        <i className="fa fa-trash" style={{ color:'red' }}
                                            onClick={() => {
                                                let data_delete = [...this.state.keranjang]
                                                data_delete.splice(index, 1)
                                                this.setState({
                                                    keranjang: data_delete
                                                })
                                            }}
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Row style={{ textAlign:'right' }} className="mr-5">
                        <Col xs={12}>
                            <Button variant="outline-success" onClick={this.addEmployee}><i className="fa fa-plus"></i> Add Products</Button>
                        </Col>
                    </Row>

                    <Row style={{ textAlign:'right' }} className="mt-5 mr-5">
                        <Col xs={10}>
                            <strong>TOTAL PERCENT</strong> 
                        </Col>

                        <Col xs={2}>
                            <strong>Rp {this.getTotalPercents(this.state.keranjang)} %</strong>
                        </Col>
                    </Row>


                    <Row style={{ textAlign:'right' }} className="mt-5 mr-5">
                        <Col xs={12}>
                            <Link href="/payments">
                                <Button variant="secondary">Cancel</Button> 
                            </Link> {' '} 
                            <Button variant="success" onClick={this.submitCheckOut}> Submit</Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Layout>
      );
    }
  }
  function mapStateToProps ( state ) {
    const { dataUser, total } = state.user;
    const { data } = state.payment;
    return {
        dataUser,
        total,
        data,
    };
}

function mapDispatchToProps (dispatch) {
    return {
        getUser: (opts) => dispatch(getUser(opts)),
        updatePayment: (id, payload, opts) => dispatch(updatePayment(id, payload, opts)),
        showPayment: (id, payload, opts) => dispatch(showPayment(id, payload, opts)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
  