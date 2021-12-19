import BaseService from "./baseService.js";
import cloneDeep from 'lodash/cloneDeep'

class UserService extends BaseService {
  
  getUser(opts = {}) {
    this.endPoint = `/users`;
    return this.get(opts);
  }
  
  storeUser(payload, opts = {}) {
    this.endPoint = "/users";
    return this.post(payload, opts);
  }

  updateUser(id, opts) {
    this.endPoint = "/users";
    return this.putOne(id, opts);
  }

  deleteUser(id, opts = {}) {
    this.endPoint = "/users";
    return this.delete(id, opts);
  }
}

export default new UserService();
