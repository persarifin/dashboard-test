import BaseService from './baseService.js'

class PermissionService extends BaseService{
    getPermissions(opts = {}){
        this.endPoint = `/permissions`;
        return this.get(opts)
    }
}

export default new PermissionService()