import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import React from 'react'
import {Button,  Modal, Form, Row, Col} from 'react-bootstrap';
class Alert extends React.Component{

    render(){
        return(
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                centered
            >
            <Modal.Header closeButton style={{ border:'none', paddingLeft:'20px' }}>
                <Modal.Title id="example-custom-modal-styling-title">
                    <small>{this.props.title}</small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '20px 65px 20px 65px' }}>
                {this.props.body}
            </Modal.Body>
            <Modal.Footer style={{ border:'none' }}>
                <Button variant="danger" onClick={this.props.deleteData}>Delete</Button>
                <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                
            </Modal.Footer>
            </Modal>
        )
    }
}


export default Alert;