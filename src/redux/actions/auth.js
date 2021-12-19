import AuthService from "../../service/auth";
import encryptedLS from "libs/encryptedLS";
import { showLoadingSpinner, hideLoadingSpinner } from "components/Layout";

export const LoginAuth = (email, password) => async (
  dispatch
) => {
  showLoadingSpinner();
  try {
    let response = await AuthService.login(email, password);

    const user = response.data.data.user;

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user },
    });

    encryptedLS.set("___user_data", {
      ...response.data.data.token,
      roles: response.data.data.user.roles,
      permissions: response.data.data.permissions,
    });
    return true;
  } catch (e) {
    console.log(e)
    hideLoadingSpinner();
    throw {
      message: e,
    };
  }
};
// export const LoginAuth = (email, password) => (dispatch) => {
//   return AuthService.login(email, password).then(
//     (data) => {
//       dispatch({
//         type: "LOGIN_SUCCESS",
//         payload: { user: data.data.data.user },
//       });

//       encryptedLS.set("___user_data", {
//         ...data.data.data.token,
//         permissions: data.data.data.permissions
//       });

//       return Promise.resolve();
//     },
//     (error) => {
//       dispatch({
//         type: "LOGIN_FAIL",
//       });

//       return Promise.reject();
//     }
//   );
// };

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: "LOGOUT",
  });
};
