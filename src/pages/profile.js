import  React, {Component} from 'react';
import {Card, Col, Row, Table, Form, InputGroup, FormControl, Button, Badge, Image} from 'react-bootstrap';
import Layout from '../components/Layout';
import { updateProfile, getUser } from "../redux/actions/user";
import {connect} from 'react-redux'
import {alertSuccess} from '../components/alert'

class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showNewPassword: false,
            payload: {
                full_name: null,
                username: null,
                email: null,
                phone: null
            },
            photoIdCard: null,
            photoProfile: null,
            photoSelfie: null,
            photoTaxNumber: null
        }
    }

    componentDidMount() {
        let opts = {
            params: {
                include: 'user_attachment',
            }
        }
        this.props.getUser(this.props.dataUser.id, opts).then(() => {
            this.setState({
                payload: {
                    ...this.state.payload,
                    full_name: this.props.data.attributes.full_name,
                    username: this.props.data.attributes.username,
                    email: this.props.data.attributes.email,
                    phone: this.props.data.attributes.phone
                }
            })
        })
    }

    updateProfile = async () => {
        let payload = new FormData();
        payload.append('full_name', this.state.payload.full_name)
        payload.append('username', this.state.payload.username)
        payload.append('email', this.state.payload.email)
        payload.append('phone', this.state.payload.phone)
        let attachemnts = [];
        if(this.state.photoIdCard){
            attachemnts.push({
                attachment_type: 'ID CARD PHOTO',
                file: this.state.photoIdCard,
            })
        }

        if(this.state.photoProfile){
            attachemnts.push({
                attachment_type: 'PHOTO PROFILE',
                file: this.state.photoProfile,
            })
        }

        if(this.state.photoSelfie){
            attachemnts.push({
                attachment_type: 'SELFIE PHOTO',
                file: this.state.photoSelfie,
            })
        }

        if(this.state.photoTaxNumber){
            attachemnts.push({
                attachment_type: 'TAX NUMBER PHOTO',
                file: this.state.photoTaxNumber,
            })
        }

        if(attachemnts.length){
            attachemnts.forEach((d) => {
                payload.append('attachments[][file]', d.file)
                payload.append('attachments[][attachment_type]', d.attachment_type)
            })
        }

        let opts = {
            params: {
                include: 'user_attachment',
            }
        }
        await this.props.updateProfile(payload, opts).then((data) => {
            alertSuccess('Update Profile Sucsessfully')
        })
    }

    handleInput = (key) => (e) => {
        this.setState({
            payload: {
                ...this.state.payload,
                [key]: e.target.value,
            },
        });
      };

    render () {
        let { full_name, username, email, phone } = this.state.payload
      return (
        <Layout title="Profile" classname="dashboard theme-light">
            <Card style={{ backgroundColor: 'white', borderRadius:'10px' }}>
                <Row className="mb-5">
                    <Col xs={12} style={{ textAlign:'center' }}>
                       <div className="backgorund-profil">
                            <Image 
                                style={{ marginTop:'30px' }}
                                src="https://thumbs.dreamstime.com/z/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                                height="130"
                             roundedCircle />
                          </div>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ textAlign:'end' }} xs={1}>
                        <i className="fa fa-user" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#D9FCED', color:'#0DAA66', padding:'13px' }}></i>
                    </Col>
                    <Col xs={11}>
                       <strong><h5 style={{ marginTop:'10px' }}>Personal Information</h5> </strong>
                    </Col>
                </Row>
                <Row className="mr-5">
                    <Col xs={1}></Col>
                    <Col xs={11} style={{ textAlign:'end' }}>
                       <hr />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Full Name</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4} style={{ textAlign:'end' }}>
                        <Form.Control type="text" placeholder="Full Name" width="333" defaultValue={full_name} onChange={this.handleInput("full_name")} />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Username</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4} style={{ textAlign:'end' }}>
                        <Form.Control type="text" placeholder="Username" width="333" defaultValue={username} onChange={this.handleInput("username")} />
                    </Col>
                </Row>


                {/* <Row className="mt-5">
                    <Col style={{ textAlign:'end' }} xs={1}>
                        <i className="fa fa-lock" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#D9FCED', color:'#0DAA66', padding:'13px' }}></i>
                    </Col>
                    <Col xs={11}>
                       <strong><h5 style={{ marginTop:'10px' }}>Password & Security</h5> </strong>
                    </Col>
                </Row>
                <Row className="mr-5">
                    <Col xs={1}></Col>
                    <Col xs={11} style={{ textAlign:'end' }}>
                       <hr />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Password</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4}>
                        <Button variant="outline-success" onClick={() => this.setState({
                            showNewPassword: !this.state.showNewPassword
                        })}>Change Password</Button>
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Current Password</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4} style={{ textAlign:'end' }}>
                    <InputGroup className="mb-2">
                        <InputGroup.Prepend>
                        <InputGroup.Text><i className="fa fa-lock"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl id="inlineFormInputGroup" type="password" placeholder="Password" />
                    </InputGroup>
                    </Col>
                </Row>

                {this.state.showNewPassword && <Row className="mt-5 mr-5">
                    <Col xs="1"></Col>
                    <Col xs="11" style={{ backgroundColor: '#F7F8FC', borderRadius:'15px' }} className="p-5">
                        <Row>
                            <Col xs="3" className="pt-1">
                                <strong>New Password</strong>
                            </Col>
                            <Col xs="5">
                            <InputGroup>
                                <InputGroup.Prepend>
                                <InputGroup.Text><i className="fa fa-lock"></i></InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl id="inlineFormInputGroup" type="password" placeholder="Password" />
                            </InputGroup>
                            </Col>
                        </Row>
                        <Row className="pt-4">
                            <Col xs="3" className="pt-1">
                                <strong>Confirm New Password</strong>
                            </Col>
                            <Col xs="5">
                                <Form.Control type="text" placeholder="Confirm New Password" width="333" />
                            </Col>
                        </Row>
                        <Row className="pt-5">
                            <Col xs="12" className="pt-1" style={{ textAlign:'end' }}>
                            <Button variant="secondary">
                                DISCARD
                            </Button> { ' '}
                            <Button variant="success">
                                SAVE
                            </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row> } */}

                <Row className="mt-5">
                    <Col style={{ textAlign:'end' }} xs={1}>
                        <i className="fa fa-phone" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#D9FCED', color:'#0DAA66', padding:'13px' }}></i>
                    </Col>
                    <Col xs={11}>
                       <strong><h5 style={{ marginTop:'10px' }}>Contact Information</h5> </strong>
                    </Col>
                </Row>
                <Row className="mr-5">
                    <Col xs={1}></Col>
                    <Col xs={11} style={{ textAlign:'end' }}>
                       <hr />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Phone</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4}>
                        <Form.Control type="text" placeholder="Phone" width="333" defaultValue={phone} onChange={this.handleInput("phone")} />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Email</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4} style={{ textAlign:'end' }}>
                    <Form.Control type="text" placeholder="Email" width="333" defaultValue={email} onChange={this.handleInput("email")}  />
                    </Col>
                </Row>


                <Row className="mt-5">
                    <Col style={{ textAlign:'end' }} xs={1}>
                        <i className="fa fa-paste" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#D9FCED', color:'#0DAA66', padding:'13px' }}></i>
                    </Col>
                    <Col xs={11}>
                       <strong><h5 style={{ marginTop:'10px' }}>Documents</h5> </strong>
                    </Col>
                </Row>
                <Row className="mr-5">
                    <Col xs={1}></Col>
                    <Col xs={11} style={{ textAlign:'end' }}>
                       <hr />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>ID CARD PHOTO</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4}>
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-paperclip"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.File 
                                id="custom-file-translate-scss"
                                label="no file chosen"
                                lang="en"
                                data-browse="Chosee File"
                                custom
                                onChange={(e) => this.setState({ photoIdCard: e.target.files[0] })}
                            />
                        </InputGroup>
                        <a>View File</a>
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>PHOTO PROFILE</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4}>
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-paperclip"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.File 
                                id="custom-file-translate-scss"
                                label="no file chosen"
                                lang="en"
                                data-browse="Chosee File"
                                custom
                                onChange={(e) => this.setState({ photoProfile: e.target.files[0] })}
                            />
                        </InputGroup>
                        <a>View File</a>
                    </Col>
                </Row>

                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>SELFIE PHOTO</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4}>
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-paperclip"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.File 
                                id="custom-file-translate-scss"
                                label="no file chosen"
                                lang="en"
                                data-browse="Chosee File"
                                custom
                                onChange={(e) => this.setState({ photoSelfie: e.target.files[0] })}
                            />
                        </InputGroup>
                        <a>View File</a>
                    </Col>
                </Row>

                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>TAX NUMBER PHOTO</strong>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={4}>
                        <InputGroup className="mb-2">
                            <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-paperclip"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.File 
                                id="custom-file-translate-scss"
                                label="no file chosen"
                                lang="en"
                                data-browse="Chosee File"
                                custom
                                onChange={(e) => this.setState({ photoTaxNumber: e.target.files[0] })}
                            />
                        </InputGroup>
                        <a>View File</a>
                    </Col>
                </Row>

                

                {/* <Row className="mt-5">
                    <Col style={{ textAlign:'end' }} xs={1}>
                        <i className="fa fa-bell" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#D9FCED', color:'#0DAA66', padding:'13px' }}></i>
                    </Col>
                    <Col xs={11}>
                       <strong><h5 style={{ marginTop:'10px' }}>Notifications</h5> </strong>
                    </Col>
                </Row>
                <Row className="mr-5">
                    <Col xs={1}></Col>
                    <Col xs={11} style={{ textAlign:'end' }}>
                       <hr />
                    </Col>
                </Row>
                <Row className="mt-3 mr-5 mb-3">
                    <Col xs={1}></Col>
                    <Col xs={4}>
                       <strong>Receive Notifications From These Features</strong>
                    </Col>
                </Row>
                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={3}>
                       <strong>Transaction</strong>
                    </Col>
                    <Col xs={2}>
                        <strong>Wallet</strong>
                    </Col>
                    <Col xs={3}>
                        <strong>Manage</strong>
                    </Col>
                    <Col xs={3}>
                        <strong>Product and Service</strong>
                    </Col>
                </Row>

                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={3}>
                        <label className="custom-checkbox">New Income Submission
                            <input type="checkbox" value="New Income Submission" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                    <Col xs={2}>
                        <label className="custom-checkbox">Reconciliation
                            <input type="checkbox" value="Reconciliation" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                    <Col xs={3}>
                        <label className="custom-checkbox">New User Created
                            <input type="checkbox" value="New User Created" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                    <Col xs={3}>
                        <label className="custom-checkbox">New Product Submission
                            <input type="checkbox" value="New Product Submission" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                </Row>

                <Row className="mt-3 mr-5">
                    <Col xs={1}></Col>
                    <Col xs={3}>
                        <label className="custom-checkbox">New Expenses Submission
                            <input type="checkbox" value="New Expenses Submission" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                    <Col xs={2}>
                        <label className="custom-checkbox">New Wallet
                            <input type="checkbox" value="New Wallet" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                    <Col xs={3}>
                        <label className="custom-checkbox">Update Company Data
                            <input type="checkbox" value="Update Company Data" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                    <Col xs={3}>
                        <label className="custom-checkbox">New Service Submission
                            <input type="checkbox" value="New Service Submission" />
                            <span className="checkmark"></span>
                        </label>
                    </Col>
                </Row> */}

                <hr className="m-5" />
                
                <div className="m-5" style={{ textAlign:'right' }}>
                    <Button variant="success" onClick={this.updateProfile}>
                        UPDATE
                    </Button>
                </div>


            </Card>
        </Layout>
      );
    }
  }

  function mapStateToProps ( state ) {
    const { data, include } = state.user;
    return {
        data: data,
        include,
        dataUser: state.auth.user
    };
}
  
  function mapDispatchToProps (dispatch) {
    return {
        getUser: (id, opts) => dispatch(getUser(id, opts)),
        updateProfile: (payload, opts) => dispatch(updateProfile(payload, opts)),
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
  