import BaseService from "./baseService.js";

class AuthService extends BaseService {
  login(email, password, interfaceApps) {
    this.endPoint = "/login";
    const user = {
      email: email,
      password: password,
      interface: interfaceApps,
    };

    return this.post(user);
  }

  logout() {
    localStorage.removeItem("___user_data");
  }
}

export default new AuthService();
