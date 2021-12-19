import * as React from "react";
import Link from "next/link";
import Router from "next/router";
import { Nav, NavDropdown, FormControl, Form, Badge, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { logout } from "redux/actions/auth";
import ModalCustom from './ModalCustom'
import {alertSuccess} from './alert'

class Header extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      modal:false,
      password: null,
      confirm_password: null
    }
  }

  handleLogOut = (e) => {
    if (e) e.preventDefault();
    this.props.logout();
    Router.replace("/login"); 
  };
  render() {
    return (
      <Nav className="align-items-center">
        <Nav.Link style={{ cursor: "auto" }}>
            <a onClick={this.handleLogOut} className="d-block navbarLink">
              <p className="mb-0">Log Out</p>
            </a>
        </Nav.Link>
      </Nav>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;
  return {
    user,
  };
};
function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
