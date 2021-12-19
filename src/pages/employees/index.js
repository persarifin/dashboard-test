import * as React from 'react';
import {Button,Tabs, Tab, Row, Col, Card, Form, InputGroup, FormControl, Modal, Badge} from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Layout from '../../components/Layout';
import { getUser, storeUser, updateUser, deleteUser } from "../../redux/actions/user";
import {connect} from 'react-redux'
import {toast} from 'react-toastify'

class index extends React.Component {
    
  constructor(props){
    super(props)
    this.state = {
            columnsUser:[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    width: '20%'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    width: '40%'
                },
                {
                    name: 'Actions',
                    selector: (row, index) => (<div>
                    <img className="mr-2" style={{width: '15px'}} src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/border-color-24px.png" onClick={ () => this.setState({
                        modal:true, 
                        tabIndex:index, 
                        dataDetailUser:row,
                        payloadUser: {
                            ...this.state.payloadUser,
                            name: row.name
                        }
                    })} /><img style={{width: '15px'}} src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/delete.png" onClick={() => this.handleDelete(row.id)} /></div>),
                    width: '10%'
                }
            ],
            payloadUser: {
                name: null
            },
            data: [],
            modal: false,
            tabIndex: -1,
            dataDetailUser: null
        }

    }

    handleSaveUser = async (e) => {
        e.preventDefault()
        if(this.state.tabIndex === -1){
            await this.props.storeUser(this.state.payloadUser)
            toast.success("Data Berhasil di Simpan", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            })
        }else{
            await this.props.updateUser(this.state.dataDetailUser.id, this.state.payloadUser, {});
            toast.success("Data Berhasil di Update", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            })
        }
        this.getData()
        this.setState({
            modal: false
        })
    }  

    async componentDidMount() {
        this.getData()
        
    }

    getData = async () => {
        let opts = {
            params:{
                'filter[roles.name][like]':'buruh'
            }
        }
        await this.props.getUser(opts).then(() => {
            this.setState({
                data: this.props.dataUser
            })
        })
    }

    handleDelete = async (id) => {
        await this.props.deleteUser(id).then(() => {
            this.getData()
            toast.success("Data Berhasil di Delete", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            })
        })
    }

    render () {
      return (
        
        <Layout title=" User" classname="dashboard theme-light">
        {/* Modal Form */}
        <Modal
            show={this.state.modal}
            onHide={() => this.setState({
                modal: false, 
                tabIndex: -1, 
                statusProduct: null,
                payloadUser: {
                    ...this.state.payloadUser,
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
            <Modal.Title>{this.state.tabIndex == -1 ? 'Create User' : 'Edit User'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={this.saveProduct}>
            <Modal.Body className="p-5">
                <Row>
                    <Col xs={4} className="pt-1">
                        <strong>User Name</strong>
                    </Col>
                    <Col xs={8}>
                        <Form.Control type="text" defaultValue={this.state.payloadUser.name} onChange={(e) => this.setState({
                            payloadUser:{
                                ...this.state.payloadUser,
                                name: e.target.value
                            },
                            
                        })} min="0" placeholder="User Name" />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer style={{ border:'none' }}>
            <Button variant="secondary" onClick={() => this.setState({
                modal: false, 
                tabIndex: -1, 
                statusProduct: null,
                payloadUser: {
                    ...this.state.payloadUser,
                    name: null
                }
            })}>
                Close
            </Button>
            <Button variant="primary" type="submit" onClick={this.handleSaveUser}>Save</Button>
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
                                                Find User s By Name
                                            </Form.Label>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                <InputGroup.Text style={{ backgroundColor:'white' }}><i className="fa fa-search"></i></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl id="inlineFormInputGroup" placeholder="Find User s By Name" onKeyPress={this.handleSearch} onChange={(e) => this.setState({ inputSearch: e.target.value })} />
                                            </InputGroup>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </Col>
                            <Col xs={2} style={{ textAlign:'end' }}>
                                <Button variant="success" onClick={() => {
                                    this.setState({modal: true})
                                }}>Add User</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <DataTable
                                    data={this.state.data}
                                    columns={this.state.columnsUser}
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
   
    const { dataUser, total } = state.user;
    return {
        dataUser,
        total
    };
}
  
  function mapDispatchToProps (dispatch) {
    return {
    getUser: (opts) => dispatch(getUser(opts)),
    storeUser: (payload, opts) => dispatch(storeUser(payload, opts)),
    updateUser: (id, payload, opts) => dispatch(updateUser(id, payload, opts)),
    deleteUser: (id) => dispatch(deleteUser(id)),
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(index);
  