import * as React from "react";
import {
  Navbar,
  Nav,
  Badge,
  Form,
  FormControl,
  NavDropdown,
  Modal,
} from "react-bootstrap";
import Router from "next/router";
import Link from "../components/ActiveLink";
import encryptedLS from "libs/encryptedLS";
import { withRouter } from "next/router";

const currentUserDontHavePermissions = (permissions) => (userPermissions) => {
  if (!userPermissions) return true;
  return !permissions.some((r) => userPermissions.indexOf(r) >= 0);
};

const isPathnameAndLinkMatch = (url, link) => link.indexOf(url.pathname) >= 0;

class Menu extends React.Component {
  state = {
    show: false,
    setShow: false,
    showModal: false,
    userPermissions: [],
  };

  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.state = {
      show: false,
      setShow: false,
    };
  }

  componentDidMount() {
    let currentSession = null;
    currentSession = encryptedLS.get("___user_data");
    let userPermissions = [];
    if (!currentSession) {
      Router.replace("/login");
    }
    userPermissions = currentSession.permissions;
    this.setState({
      userPermissions,
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { userPermissions } = this.state;
    const { router } = this.props;
    return (
      <div>
        <Navbar id="responsive-navbar-nav" className="p-0">
          <Nav className="sidebar-contents">
            <Link href="/payments" activeClassName="active">
              <a className="nav-link data-table">
                <img
                  className="mr-2 ml-2"
                  style={{ width: "15px" }}
                  src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/wallet.png"
                />{" "}
                <span className="span-text">Pembayaran</span>
              </a>
            </Link>
            <Link href="/employees" activeClassName="active">
              <a className="nav-link data-table">
              <img
                className="mr-2 ml-2"
                style={{ width: "14px" }}
                src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/database.png"
              />{" "}
                <span className="span-text">Employee</span>
              </a>
            </Link>
            {/* <NavDropdown
              className="elements"
              title={
                <span>
                  <img
                    className="mr-2 ml-2"
                    style={{ width: "14px" }}
                    src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/settings.png"
                  />{" "}
                  <span className="span-text">Settings</span>{" "}
                </span>
              }
              id="uielemets"
            >
              <li>
                <Link href="/settings-role" activeClassName="active">
                  <a className="child-nav-list dropdown-item buttons">
                    User Role
                  </a>
                </Link>
              </li>
            </NavDropdown> */}
          </Nav>
        </Navbar>


        <Modal
          show={this.state.showModal}
          size="md"
          onHide={this.handleCloseModal}
          className="p-0"
        >
          <Modal.Header
            closeButton
            className="p-t-0 p-b-0 purpleBg "
            style={{ border: "0" }}
          />
          {/* <ModalPrime /> */}
        </Modal>
      </div>
    );
  }
}
export default withRouter(Menu);
