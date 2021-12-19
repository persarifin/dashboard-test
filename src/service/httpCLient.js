import axios from "axios";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import Router from "next/router";
import ReactHtmlParser from "react-html-parser";

// import AuthService from '../service/auth.service'
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000 * (60 * 3),
});

axiosInstance.interceptors.request.use(
  function (config) {
    NProgress.start();
    return config;
  },
  function (error) {
    // console.error(error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    NProgress.done();
    return Promise.resolve(response);
  },
  function (error) {
    if (!error.response || error.code === 'ECONNABORTED') {
      toast.error("Please check your internet connection.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } else {
      let message = buildErrorMessage(error);

      toast.error(
        <div>
          <h4 style={{ color: "white", fontWeight: "bold" }}>Oops Error!</h4>
          {ReactHtmlParser(message)}
        </div>,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000 * 5,
        }
      );
      // check if session expired
      if (error.response.status == 401) {
        localStorage.removeItem("___user_data");
        return Router.replace("/login");
      }
    }
    NProgress.done();
    return Promise.reject();
  }
);

const buildErrorMessage = (error) => {
  let message = "";
  if (error.response.data) {
    if (error.response.data.data) {
      message = error.response.data.data;
    } else if (error.response.data.values) {
      message = error.response.data.values;
    } else {
      message = error.response.data.message;
    }
  }
  // let message =
  //   error.response.data && error.response.data.data
  //     ? error.response.data.data
  //     : error.response.data.message
  //     ? error.response.data.message
  //     : null;
  let flashMessage = [];

  if (typeof message === "object") {
    for (let err of Object.keys(message)) {
      if (message[err].length > 0) {
        flashMessage.push(message[err][0]);
      } else {
        flashMessage.push(message[err]);
      }
    }
  } else {
    flashMessage = message;
  }

  if (Array.isArray(flashMessage) && flashMessage.length > 0) {
    flashMessage = flashMessage.join("<br/>");
  } else {
    flashMessage = flashMessage;
  }
  return flashMessage;
};

export default axiosInstance;
