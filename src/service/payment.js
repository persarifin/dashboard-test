import BaseService from './baseService.js'
import cloneDeep from 'lodash/cloneDeep'

class PaymentService extends BaseService{

    getPayment(opts = {}){
        this.endPoint = '/payments'
        return this.get(opts)
    }

    storePayment(payload, opts ={}){
        this.endPoint = '/payments'
        return this.post(payload, opts);
    }

    updatePayment(id, payload, opts = {}) {
        this.endPoint = `/payments`;
        return this.putOne(id, payload, opts);
    }

    showPayment(id, payload, opts = {}) {
        this.endPoint = `/payments`;
        return this.getOne(id, payload, opts);
    }

    deletePayment(id, opts = {}){
        this.endPoint = '/payments'
        return this.delete(id, opts)
    }

}

export default new PaymentService()