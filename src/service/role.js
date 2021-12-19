import BaseService from './baseService.js'

class RoleService extends BaseService{
    getRole(opts = {}){
        this.endPoint = '/roles'
        return this.get(opts)
    }

    storeRole(payload){
        this.endPoint = '/roles'
        return this.post(payload);
    }

    updateRole(payload, opts ={}){
        this.endPoint = '/roles/' + payload.id
        return this.put(payload)
    }

    deleteRole(id, opts = {}){
        this.endPoint = '/roles'
        return this.delete(id, opts)
    }

}

export default new RoleService()