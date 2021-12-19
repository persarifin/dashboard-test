import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";
import { connect } from "react-redux";
import { LoginAuth } from "../redux/actions/auth";
import { useRouter } from "next/router";
import { hashByCrypto } from "libs/hashing";
import dayjs from "dayjs";
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

let _loadingSpinner = null;

export const LoadingSpinner = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(props.visible);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

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
          border-top: 5px solid #0daa66; /* Green */
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
});

const login = (props) => {
  const [passwordShown, setpasswordShown] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const router = useRouter();

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const functLogin = async () => {
    let interfaceApps = "WEB COMPANY";
    const hash = await new Promise((resolve, reject) => {
      hashByCrypto(
        "SHA-256",
        `${interfaceApps}${dayjs().utc().format("YYYY-MM-DD HH:mm")}`
      ).then((res) => resolve(res));
    });
    interfaceApps = hash;
    const { dispatch } = props;

    showLoadingSpinner();
    dispatch(LoginAuth(username, password, interfaceApps))
      .then(() => {
        router.push("/payments");
      })
      .catch((e) => hideLoadingSpinner())
      .finally(hideLoadingSpinner());
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      functLogin();
    }
  };

  const handleShowPassword = () => {
    setpasswordShown(passwordShown ? false : true);
  };

  const handleButtonLoginListerner = () => {
    functLogin();
  };
  _loadingSpinner = useRef();
  return (
    <div className="login">
      <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <LoadingSpinner visible={false} ref={_loadingSpinner} />
      <Row>
        <Col lg={6} md={12} className="p-0 registraion">
          <div className="d-flex align-items-center justify-content-center flex-column h-100vh login-box text-center"></div>
        </Col>
        <Col lg={6} md={12} className="p-0 login-form">
          <div className="d-flex align-items-center justify-content-center h-100vh login-form loginBg">
            <div className="d-flex flex-column login-container">
              <div className="d-flex align-items-center justify-content-center brand-container mb-4">
                <Image
                  src="https://storage.googleapis.com/spaces-semanggi-app/back-office/png/logo-semanggi-1.4.png"
                  fluid
                  className="logo-img"
                />
              </div>
              <Form className="text-center">
                <Form.Group controlId="LoginEmail">
                  <Form.Control
                    type="email"
                    className="text-xlg"
                    placeholder="E-mail, Username or Phone Number"
                    onChange={handleChangeUsername}
                  />
                </Form.Group>
                <Form.Group
                  controlId="LoginPassword"
                  className="custom-password position-relative"
                >
                  <Form.Control
                    type={passwordShown ? "text" : "password"}
                    className="text-xlg"
                    placeholder="Password"
                    onChange={handleChangePassword}
                    onKeyDown={keyPress}
                  />
                  <span
                    className="position-absolute"
                    onClick={handleShowPassword}
                  >
                    <p>
                      <i
                        className={
                          passwordShown
                            ? "fa fa-eye-slash fa-lg"
                            : "fa fa-eye fa-lg"
                        }
                      />
                    </p>
                  </span>
                </Form.Group>
                <Button
                  onClick={handleButtonLoginListerner}
                  className="btn btn-block btn-lg btn-success"
                >
                  <a className="text-white">Login</a>
                </Button>
                <p
                  className="m-t-15 text-xxlg"
                  style={{ visibility: "hidden" }}
                >
                  <span className="text-muted">Don't have an account?</span>
                  <Link href="/register">
                    <span>
                      {" "}
                      <b>Create Account</b>
                    </span>
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const showLoadingSpinner = () => {
  if (!_loadingSpinner) return;
  _loadingSpinner.current.show();
};

const hideLoadingSpinner = () => {
  if (!_loadingSpinner) return;
  _loadingSpinner.current.hide();
};

function mapDispatchToProps(state) {
  const { isLoggedIn } = state.auth;
  return {
    isLoggedIn,
  };
}

export default connect(mapDispatchToProps)(login);
