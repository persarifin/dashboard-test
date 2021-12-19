import UserService from "../../service/user";
import { hideLoadingSpinner } from "components/Layout";

export const getUser = (opts) => (dispatch) => {
  return UserService.getUser(opts).then(
    (data) => {
      dispatch({
        type: "GET_USER",
        payload: {
          data: data.data.data.data,
          total: data.data.data.total,
        },
      });
      console.log(data.data.data.data)
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });
      hideLoadingSpinner();
      return Promise.reject();
    }
  );
};


export const storeUser = (payload, opts) => (dispatch) => {
  return UserService.storeUser(payload, opts).then(
    (data) => {
      dispatch({
        type: "STORE_USER",
        payload:{
          data:data
        }
      });
      console.log()
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject();
    }
  );
};

export const updateUser = (id, payload, opts = {}) => (dispatch) => {
  return UserService.updateUser(id, payload, opts).then(
    (data) => {
      dispatch({
          type: "UPDATE_USER",
          payload:{
            data:data
          }
      })
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject();
    }
  );
};

export const deleteUser = (id) => (dispatch) => {
  return UserService.deleteUser(id).then(
    (data) => {
      dispatch({
        type: "DELETE_USER",
      });
    },
    (error) => {
      hideLoadingSpinner();
      console.log(error);
    }
  );
};

