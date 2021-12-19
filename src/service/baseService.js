import axiosInstance from "./httpCLient";
import encryptedLS from "libs/encryptedLS";

class BaseService {
  constructor() {
    this.endPoint = "";
    this.setBaseUrl();
  }
  setBaseUrl() {
    this.http = axiosInstance;
  }

  includeDefault(options) {
    let secureLS = encryptedLS.get("___user_data");
    let access_token =
    secureLS && secureLS.access_token ? secureLS.access_token : null;

		const defaultData = {
			headers: {
				'Content-Type': 'application/json',
				'Accept' : 'application/json',
				'Authorization': 'Bearer ' + access_token,
			}
		};
		return Object.assign(defaultData, options);
	}

  get(options = {}) {
    const opts = this.includeDefault(options);

    return this.http.get(this.endPoint, opts);
  }

  getOne(id, options = {}) {
    const opts = this.includeDefault(options);
    return this.http.get(this.endPoint + "/" + id, opts);
  }

  post(data, options = {}) {
    const opts = this.includeDefault(options);
    return axiosInstance.post(this.endPoint, data, opts);
  }
  put(data, options = {}) {
    const opts = this.includeDefault(options);

    return this.http.put(this.endPoint, data, opts);
  }
  patch(id, data, options = {}) {
    const opts = this.includeDefault(options);
    return this.http.patch(this.endPoint, data, opts);
  }
  putOne(id, data, options = {}) {
    const opts = this.includeDefault(options);
    return this.http.put(this.endPoint + "/" + id, data, opts);
  }
  delete(id, options = {}) {
    const opts = this.includeDefault(options);
    return this.http.delete(this.endPoint + "/" + id, opts);
  }
}
export default BaseService;
