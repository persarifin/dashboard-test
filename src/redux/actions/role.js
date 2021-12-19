import RoleService from "../../service/role";
import { hideLoader, showLoader } from "redux/actions/loader";
import { hideLoadingSpinner } from "../../components/Layout";

export const getRole = (opts) => (dispatch) => {
  return RoleService.getRole(opts).then(
    (response) => {
      dispatch(showLoader());
      const roles =
        response.data && response.data.data ? response.data.data : [];
      const included =
        response.data && response.data.included ? response.data.included : [];
      const meta =
        response.data && response.data.meta ? response.data.meta : {};
      dispatch({
        type: "GET_ROLE",
        payload: {
          data: roles,
          included,
          meta,
        },
      });
      dispatch(hideLoader());
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });
      hideLoadingSpinner();
      return Promise.reject(error);
    }
  );
};

export const storeRole = (payload) => (dispatch) => {
  return RoleService.storeRole(payload).then(
    (data) => {
      // dispatch({
      //   type: "STORE_ROLE",
      //   payload: {
      //     data: data.data.data,
      //   },
      // });
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

export const updateRole = (payload) => (dispatch) => {
  return RoleService.updateRole(payload).then(
    (data) => {
      // dispatch({
      //   type: "UPDATE_ROLE",
      //   payload: {
      //     data: data.data.data,
      //   },
      // });
      return Promise.resolve();
    },
    (error) => {
      hideLoadingSpinner();
      return Promise.reject();
    }
  );
};

export const destroyRole = (id) => (dispatch) => {
  return RoleService.deleteRole(id).then(
    (data) => {
      dispatch({
        type: "DELETE_ROLE",
      });
    },
    (error) => {
      hideLoadingSpinner();
    }
  );
};
