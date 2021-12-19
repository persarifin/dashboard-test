const initialState = {
    dataUser: [],
    total: 0,
    include: []
  }
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case "GET_USER":
        return {
          ...state,
          dataUser: payload.data,
          total: payload.total
        };

      case "STORE_USER":
        return {
          ...state,
          dataUser: payload.data,
        };
      case "UPDATE_USER":
        return {
          ...state,
          dataUser: payload.data,
        };
      case "DELETE_USER":
        return {
          ...state,
        };
      default:
        return state;
    }
  }