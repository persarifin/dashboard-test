const initialState = {
    total: 0,
    dataPayment: [],
    data: null
  }
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case "GET_PAYMENT":
        return {
          ...state,
          dataPayment: payload.data,
          total: payload.total
        };
      case "STORE_PAYMENT":
          return {
            ...state,
          };
      case "UPDATE_PAYMENT":
          return {
            ...state,
          };
      case "SHOW_PAYMENT":
        return {
          ...state,
          data: payload.data,
        };
      case "DELETE_PAYMENT":
          return {
            ...state,
          };
      default:
        return state;
    }
  }