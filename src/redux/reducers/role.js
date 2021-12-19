const initialState = {
  data: [],
  included: [],
  meta: {}
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case "GET_ROLE":
      return {
        ...state,
        data: payload.data,
        included: payload.included,
        meta: payload.meta
      };
    case "STORE_ROLE":
      return {
        ...state,
        data: payload.data,
      };

    case "UPDATE_ROLE":
      return {
        ...state,
        data: payload.data,
      };

    case "FAIL":
      return {
        ...state,
        data: [],
      };
    case "DELETE_ROLE":
      return {
        ...state,
      };
    default:
      return state;
  }
}
