import * as React from "react";
import { get } from "lodash";
import Head from "next/head";
import { Navbar, Nav, Image, Button, Collapse, Modal } from "react-bootstrap";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { formatCurrency } from "libs/numbers";
import { currentUserDontHavePermissions } from "libs/rolePermission";
import NoSSR from "react-no-ssr";

let _loadingSpinner = null;

class LoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }
  show = () => {
    this.setState({
      visible: true,
    });
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <div>
        <div
          className="loader-wrapper"
          style={{
            visibility: visible ? "visible" : "hidden",
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="loader" />
        </div>
        <style jsx>{`
          .loader-wrapper {
            -webkit-transition: visibility 0s linear 200ms, opacity 200ms linear; /* Safari */
            transition: visibility 0s linear 200ms, opacity 200ms linear;

            opacity: 1;
            position: fixed; /* Sit on top of the page content */
            display: block; /* Hidden by default */
            width: 100%; /* Full width (cover the whole page) */
            height: 100%; /* Full height (cover the whole page) */
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(
              243,
              243,
              243,
              0.4
            ); /* Black background with opacity */
            z-index: 9997; /* Specify a stack order in case you're using a different order for other elements */
            cursor: pointer; /* Add a pointer on hover */
          }
          .loader {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            border: 3px solid #f3f3f3; /* Light grey */
            border-top: 3px solid #0daa66; /* Green */
            border-radius: 50%;
            width: 70px;
            height: 70px;
            animation: spin 1s linear infinite;
          }

          .mini-loader {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            border: 5px solid #ccc; /* Light grey */
            border-top: 5px solid #0daa66; /* Green */
            border-radius: 50%;
            width: 45px;
            height: 45px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
}

class Layout extends React.Component {
  state = {
    condition: false,
    chat: false,
    setting: false,
    show: false,
    setShow: false,
    showModal: false,
  };
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.handleSetting = this.handleSetting.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.state = {
      condition: false,
      chat: false,
      setting: false,
      open: false,
      style: false,
      showModal: false,
      show: false,
      setShow: false,
      billingInvoiceModalVisible: false,
      notApprovedBillingInvoice: null,
    };
  }

  componentDidMount() {
    const { company, companyIncluded } = this.props;
    if (company && company.attributes) {
      if (!isEmpty(company.relationships && company.relationships.not_approved_billing_invoice)) {
        this.setState({
          notApprovedBillingInvoice:
            companyIncluded["not_approved_billing_invoice"][
              company.relationships.not_approved_billing_invoice.id
            ].attributes,
          billingInvoiceModalVisible: true,
        });
      }
    }
    hideLoadingSpinner();
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  handleChat() {
    this.setState({
      chat: !this.state.chat,
    });
  }

  handleSetting() {
    this.setState({
      setting: !this.state.setting,
    });
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleClick() {
    this.setState({
      condition: !this.state.condition,
    });
  }

  closeBillingInvoiceModal = () => {
    this.setState({
      billingInvoiceModalVisible: false,
    });
  };

  handleApproveBillingInvoice = async (e) => {
    if (e) e.preventDefault();
    const { notApprovedBillingInvoice } = this.state;
    showLoadingSpinner();
    
    addNotification({
      level: "success",
      message: "Approved billing invoices successfully!",
    });
    this.setState({
      billingInvoiceModalVisible: false,
    });
    hideLoadingSpinner();
  };

  render() {
    const { title, customTitle } = this.props;
    const classname = get(this.props, "classname", " ");
    const {
      billingInvoiceModalVisible,
      notApprovedBillingInvoice,
    } = this.state;
    return (
      <div className={classname}>
        <Head>
          {/* <html className="theme-light"> */}
          <title>PRETEST - {title}</title>
          <meta charSet="utf-8" />
          <link
            rel="icon"
            href="../static/images/favicon.png"
            type="image/x-icon"
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          {/* </html> */}
        </Head>

        {/* Left Navigation */}

        <LoadingSpinner
          visible={true}
          ref={(comp) => {
            _loadingSpinner = comp;
          }}
        />
        {/* Modal Edit Billing Invoice */}
        <Modal
          show={billingInvoiceModalVisible}
          onHide={this.closeBillingInvoiceModal}
          dialogClassName="modal-90w"
          centered
        >
          <Modal.Header
            closeButton
            style={{ border: "none", paddingLeft: "20px" }}
          >
            <Modal.Title id="example-custom-modal-styling-title">
              <h3>Bill Info</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "20px 30px 20px 30px" }}>
            {currentUserDontHavePermissions(["Approve Billing Invoices"]) ? (
              <h5 className="text-center mb-2">
                Do you agree with a monthly bill of:{" "}
              </h5>
            ) : (
              <h5 className="text-center mb-2">
                Total bill monthly your company is:{" "}
              </h5>
            )}

            <h3 className="text-danger text-center my-3">
              {notApprovedBillingInvoice && notApprovedBillingInvoice.amount
                ? "Rp" + formatCurrency(notApprovedBillingInvoice.amount)
                : null}
            </h3>
            {!currentUserDontHavePermissions([
              "Approve Billing Invoices",
            ]) ? null : (
              <p className="text-center">
                Please ask Administrator or Manager of your Company
              </p>
            )}
          </Modal.Body>
          <Modal.Footer style={{ border: "none" }}>
            <Button
              className={`btn-${
                !currentUserDontHavePermissions(["Approve Billing Invoices"])
                  ? "danger-semanggi"
                  : "secondary-semanggi"
              }`}
              onClick={this.closeBillingInvoiceModal}
            >
              {!currentUserDontHavePermissions(["Approve Billing Invoices"])
                ? "Reject"
                : "Close"}
            </Button>
            {!currentUserDontHavePermissions(["Approve Billing Invoices"]) ? (
              <Button
                className="btn-success-semanggi"
                onClick={this.handleApproveBillingInvoice}
              >
                Approve
              </Button>
            ) : null}
          </Modal.Footer>
        </Modal>

        <div
          style={{ overflowX: "hidden", overflowY: "hidden" }}
          className={
            this.state.condition
              ? "col-sm-2 bg-light sidebar toggled sidebartext position-fixed w-200 h-100vh horizantal"
              : "bg-light sidebar sidebartext position-fixed w-200 h-100vh horizantal"
          }
        >
          <Navbar className="flex-column p-0 mb-4 align-items-left">
            <Navbar.Brand
              href="/#home"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <div className="text-logo">
                <h3 style={{ letterSpacing: "2px", marginBottom: 0 }}>
                  PRETEST
                </h3>
                <p style={{ fontSize: "0.6em", margin: 0 }}>
                  TRYNG NEW THING 
                </p>
              </div>
            </Navbar.Brand>
            <i className="fa fa-close" onClick={this.handleClick} />
            <Menu />
          </Navbar>
        </div>
        {/* End of Left Navigation */}

        <div
          className={
            this.state.condition
              ? "main-conatiner toggled row"
              : "main-conatiner row"
          }
        >
          {/* Header Section */}
          <header className=" col-sm-12 headerbg position-fixed">
            <Navbar className="custom-navbar">
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <div className="d-inline-block">
                    <i
                      style={{ marginTop: "31px" }}
                      className="fa fa-bars"
                      onClick={this.handleClick}
                    />
                  </div>
                  <Nav.Link style={{ marginTop: "20px", marginLeft: "20px" }}>
                    {!customTitle ? (
                      <p>
                        <strong>{title}</strong>
                      </p>
                    ) : (
                      customTitle
                    )}
                  </Nav.Link>
                </Nav>

                <Header />
              </Navbar.Collapse>
            </Navbar>
          </header>

          {/* End of Header Section */}

          {/* Right Sidebar */}
          {/* <div className={!this.state.chat ? 'hide' : 'show'}>
            <div className="rightSide position-fixed theme-shadow chatbar">
              <div
                className={
                  !this.state.chat ? 'hide chatHeader' : 'show chatHeader'
                }
              >
                <div className="chat-profile d-flex align-items-center">
                  <img src="/static/images/ella.png" className="img-fluid" />
                  Ella Montgomery
                  {' '}
                  <i
                    className="fa fa-close ml-auto mr-3"
                    onClick={this.handleChat}
                  />
                </div>
              </div>
              <RightSidebar />
            </div>
          </div> */}
          {/* End of Right Sidebar */}

          {/* Main Container */}
          <NoSSR>
            <article className="col-sm-12 dashboard-section pt-3">
              {this.props.children}
            </article>
          </NoSSR>
          {/* End of Main Container */}
          <Footer />
        </div>
      </div>
    );
  }
}

export const addNotification = (params) => {
  if (!params) return;
  if (!params.level) {
    params.level = "warning";
  }
  const classes = {
    success: "custom-toast-success",
    warning: "custom-toast-warning",
  };
  toast.success(params.message, {
    className: classes[params.level],
    position: toast.POSITION.TOP_RIGHT,
    autoClose: params.duration ? params.duration : 3000,
  });
};

export const handleError = (error) => {
  console.warn("Handling error:", error.message);
  toast.error(error.message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
  });
  hideLoadingSpinner();
};

export const showLoadingSpinner = () => {
  if (!_loadingSpinner) return;
  _loadingSpinner.show();
};

export const hideLoadingSpinner = () => {
  if (!_loadingSpinner) return;
  _loadingSpinner.hide();
};




export default Layout;
