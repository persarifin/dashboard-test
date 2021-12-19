const initialState = {
  permissions: [],
};

const permission = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_PERMISSIONS":
      return {
        ...state,
        permissions: payload.data,
      };
    case "FAIL":
      return {
        ...state,
        permissions: [],
      };
    default:
      return state;
  }
};
export default permission;
