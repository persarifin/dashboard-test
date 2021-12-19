import * as React from 'react';
import {Button,Tabs, Tooltip, Row, Col, Card, Form, InputGroup, FormControl, Modal, OverlayTrigger} from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Layout from '../../components/Layout';
import Link from "next/link";
import { getPayment, deletePayment } from "../../redux/actions/payment";
import {connect} from 'react-redux'
import {toast} from 'react-toastify'

class index extends React.Component {
    
  constructor(props){
    super(props)
    this.state = {
            columnsPayment:[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    width: '20%'
                },
                {
                    name: 'Payment Name',
                    selector: 'name',
                    sortable: true,
                    width: '65%'
                },
                {
                    name: 'Actions',
                    selector: (row, index) => (<div>
                        <Link href="/payments/edit/[id]" as={`/payments/edit/${row.id}`}>
                            <img className="mr-2" style={{ width: '15px' }} src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/border-color-24px.png"/>
                        </Link>
                        
                        <img style={{width: '15px'}} src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/delete.png" onClick={() => this.handleDelete(row.id)} />
                        {' '}<Link href="/payments/detail/[id]" as={`/payments/detail/${row.id}`}>
                                <span className="d-inline-block">
                                    <Tooltip id="tooltip-enable">Detail</Tooltip>
                                    <i className="fa fa-eye-slash fa-lg"></i>
                                </span>
                            </Link></div>),
                    width: '10%'
                }
            ],
            payloadPayment: {
                name: null,
                wages:[]
            },
            data: [],
            modal: false,
            tabIndex: -1,
            dataDetailPayment: null
        }

    }

    async componentDidMount() {
        this.getData()
    }

    getData = async () => {
        await this.props.getPayment({}).then(() => {
            this.setState({
                data: this.props.dataPayment
            })
        })
    }

    handleDelete = async (id) => {
        await this.props.deletePayment(id).then(() => {
            this.getData()
            toast.success("Data Berhasil di Delete", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            })
        })
    }

    render () {
      return (
        
        <Layout title=" Payment" classname="dashboard theme-light">
        {/* Modal Form */}
        <Modal
            show={this.state.modal}
            onHide={() => this.setState({
                modal: false, 
                tabIndex: -1, 
                statusProduct: null,
                payloadPayment: {
                    ...this.state.payloadPayment,
                    name: null
                }
            })}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header style={{ border:'none' }} closeButton>
            <Modal.Title>{this.state.tabIndex == -1 ? 'Create Payment' : 'Edit Payment'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={this.saveProduct}>
            <Modal.Body className="p-5">
                <Row>
                    <Col xs={4} className="pt-1">
                        <strong>Payment Name</strong>
                    </Col>
                    <Col xs={8}>
                        <Form.Control type="text" defaultValue={this.state.payloadPayment.name} onChange={(e) => this.setState({
                            payloadPayment:{
                                ...this.state.payloadPayment,
                                name: e.target.value
                            },
                            
                        })} min="0" placeholder="Payment Name" />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer style={{ border:'none' }}>
            <Button variant="secondary" onClick={() => this.setState({
                modal: false, 
                tabIndex: -1, 
                statusProduct: null,
                payloadPayment: {
                    ...this.state.payloadPayment,
                    name: null
                }
            })}>
                Close
            </Button>
            <Button variant="primary" type="submit" onClick={this.handleSavePayment}>Save</Button>
            </Modal.Footer>
            </Form>
        </Modal>

        <Row className="pt-15">
            <Col lg={12} md={12} sm={12}>
                <Card style={{ backgroundColor: 'white', borderRadius:'10px' }}>
                    <Row className="position-relative show-grid" style={{ margin:'20px 20px 0px 20px' }}>
                    <Col xs={12}>
                        <Row className="position-relative show-grid" >
                            <Col xs={10}>
                                <Form>
                                    <Form.Row>
                                        <Col xs="4">
                                            <Form.Label htmlFor="inlineFormInputGroup" srOnly>
                                                Find Payment By Name
                                            </Form.Label>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                <InputGroup.Text style={{ backgroundColor:'white' }}><i className="fa fa-search"></i></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl id="inlineFormInputGroup" placeholder="Find Payment s By Name" onKeyPress={this.handleSearch} onChange={(e) => this.setState({ inputSearch: e.target.value })} />
                                            </InputGroup>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                            <Col xs={12} style={{ textAlign: "end" }}>
                                <Link
                                    href="/payments/create"
                                    as={`/payments/create`}
                                >
                                    <Button variant="success">Create Payment</Button>
                                </Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <DataTable
                                    data={this.state.data}
                                    columns={this.state.columnsPayment}
                                    highlightOnHover
                                    noHeader={true}
                                    paginationTotalRows={this.props.total}
                                    paginationPerPage={this.state.num}
                                    pagination
                                    paginationServer
                                    onChangePage={this.handlePageChange}
                                    onChangeRowsPerPage={this.handlePerRowsChange}
                                    // paginationServer
                                />
                            </Col>
                        </Row>
                            
                    </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        </Layout>
      );
    }

  }
  function mapStateToProps ( state ) {
   
    const { dataPayment, total } = state.payment;
    return {
        dataPayment,
        total
    };
}
  
  function mapDispatchToProps (dispatch) {
    return {
        getPayment: (opts) => dispatch(getPayment(opts)),
        deletePayment: (id) => dispatch(deletePayment(id)),
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(index);
  