import PermissionService from "../../service/permission";
import { hideLoader, showLoader } from "redux/actions/loader";

export const getPermissions = (opts) => (dispatch) => {
  return PermissionService.getPermissions(opts).then(
    (response) => {
      dispatch(showLoader());
      const roles = response.data  && response.data.data ? response.data.data : [];
      dispatch({
        type: "GET_PERMISSIONS",
        payload: {
          data: roles
        },
      });
      dispatch(hideLoader())
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject(error);
    }
  );
};