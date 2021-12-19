import encryptedLS from "libs/encryptedLS";

const currentUserDontHaveRoles = (roles) => {
  let currentSession = null;
  
  currentSession = encryptedLS.get("___user_data");
  
  if(!currentSession){
    return true;
  }
  
  const userRoles = currentSession.roles;
  
  if(!userRoles || userRoles.length < 1){
    return true;
  }
  
  // check if role super enterprise
  if(userRoles.some((r) => "super_enterprise".indexOf(r.custom_name) >= 0)){
    return false;
  }

  return userRoles.some((r) => roles.indexOf(r.custom_name) >= 0)
}

const currentUserDontHavePermissions = (permissions) => {
  let currentSession = null;
  let userPermissions = [];
  currentSession = encryptedLS.get("___user_data");
  
  if(!currentSession){
    return true;
  }

  userPermissions = currentSession.permissions;
  
  if (!userPermissions || userPermissions.length < 1 ) return true;

  return !permissions.some((r) => userPermissions.indexOf(r) >= 0);   
}

module.exports = {
  currentUserDontHaveRoles,
  currentUserDontHavePermissions
}