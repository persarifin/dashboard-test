import PaymentService from "../../service/payment";

export const getPayment = (opts) => (dispatch) => {
    return PaymentService.getPayment(opts).then(
    (data) => {
      dispatch({
          type: "GET_PAYMENT",
          payload: {
              data: data.data.data.data,
              total: data.data.data.total,
          }
      })
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject();
    }
  );
};

export const storePayment = (payload, opts = {}) => (dispatch) => {
    return PaymentService.storePayment(payload, opts).then(
    (data) => {
      dispatch({
          type: "STORE_PAYMENT",
      })
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject();
    }
  );
};

export const updatePayment = (id, payload, opts = {}) => (dispatch) => {
    return PaymentService.updatePayment(id, payload, opts).then(
    (data) => {
      dispatch({
          type: "UPDATE_PAYMENT",
      })
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject();
    }
  );
};

export const showPayment = (id, payload, opts = {}) => (dispatch) => {
  return PaymentService.showPayment(id, payload, opts).then(
  (data) => {
    dispatch({
        type: "SHOW_PAYMENT",
        payload :{
          data:data.data
        }
    })
    console.log(data)
    return Promise.resolve();
  },
  (error) => {
    dispatch({
      type: "FAIL",
    });

    return Promise.reject();
  }
);
};

export const deletePayment = (id, opts = {}) => (dispatch) => {
    return PaymentService.deletePayment(id, opts).then(
    (data) => {
      dispatch({
          type: "DELETE_PAYMENT",
      })
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: "FAIL",
      });

      return Promise.reject();
    }
  );
};

