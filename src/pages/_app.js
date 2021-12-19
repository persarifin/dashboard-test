import MyApp from "next/app";
import "../styles/global.scss";
import React from "react";
import "react-toastify/scss/main.scss";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import dynamic from "next/dynamic";
import encryptedLS from "libs/encryptedLS";
import dayjs from "dayjs";
import Router from "next/router";


const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false }
);

class App extends MyApp {
  componentDidMount() {
    this.refetchUserSession();
  }
  refetchUserSession = async () => {
    try {
      let now = dayjs().unix();
      let currentSession = null;
      currentSession = encryptedLS.get("___user_data");
      if (!currentSession) {
        Router.replace("/login");
      }
      let expiresIn = currentSession.expires_in ? currentSession.expires_in : 0;
      expiresIn = dayjs().add(expiresIn, "second").unix();

      if (now >= expiresIn) {
        localStorage.removeItem("___user_data");
        return Router.replace("/login");
      }
    } catch (err) {
      Router.replace("/dashboard");
    }
  };
  render() {
    const { Component, pageProps, dispatch } = this.props;

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
