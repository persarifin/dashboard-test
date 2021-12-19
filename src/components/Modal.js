import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

class Modal extends Component {
  handleClickModalMask = (e) => {
    if (e) e.preventDefault();
    if (this.props.closeOnBackdrop && this.props.onClose) {
      this.props.onClose();
    }
  };

  handleClickModalContent = (e) => {
    if (e) e.stopPropagation();
  };

  handleEscapeKeydown = (e) => {
    if (e.keyCode == 27) {
      this.handleClickModalMask();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleEscapeKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEscapeKeydown);
  }

  render() {
    return (
      <div
        className={
          "modal-mask " +
          (this.props.visible ? "modal-visible" : "modal-hidden")
        }
        // style={{ display: this.props.visible ? "" : "none" }}
        onClick={this.handleClickModalMask}
      >
        <div
          className={`modal-dialog modal-${
            this.props.size ? this.props.size : "md"
          }`}
        >
          <div
            className="modal-content2"
            onClick={this.handleClickModalContent}
          >
            {this.props.children}
          </div>
        </div>
        <style jsx>{`
          .modal-mask {
            position: fixed;
            z-index: 9996;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: block;
            -webkit-transition: opacity 0.3s ease-in-out;
            -o-transition: opacity 0.3s ease-in-out;
            transition: opacity 0.3s ease-in-out;
            overflow-y: auto !important;
          }
          .modal-content2 {
            border: 0px;
            -webkit-transition: transform 0.3s ease-in-out;
            -o-transition: transform 0.3s ease-in-out;
            transition: transform 0.3s ease-in-out;
          }
          .modal-visible {
            visibility: visible;
            opacity: 1;
            transition: opacity 90ms linear;
          }
          .modal-hidden {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s 90ms, opacity 90ms linear;
          }
        `}</style>
      </div>
    );
  }
}

Modal.defaultProps = {
  closeOnBackdrop: true,
  visible: false,
};

export default Modal;

export const FormModal = ({
  visible,
  onClose,
  onCloseTitle,
  onCloseStyle,
  onSubmit,
  onSubmitTitle,
  onSubmitStyle,
  title,
  children,
  size,
}) => (
  <Modal visible={visible} onClose={onClose} size={size}>
    {onSubmit ? (
      <form onSubmit={onSubmit}>
        {title ? (
          <div className="modal-header px-4">
            <h4 className="modal-title" style={{ margin: 0, padding: 0 }}>
              {title}
            </h4>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
        ) : null}
        <div className="modal-body p-5">{children}</div>
        <div className="modal-footer">
          {onClose !== null ? (
            <Button
              type="button"
              className="btn-secondary-semanggi"
              onClick={onClose}
            >
              Close
            </Button>
          ) : null}
          &nbsp;
          {onSubmit ? (
            <Button
              type="submit"
              className="btn-success-semanggi"
              style={{
                ...onSubmitStyle,
              }}
            >
              {onSubmitTitle ? onSubmitTitle : "Submit"}
            </Button>
          ) : null}
        </div>
      </form>
    ) : (
      <div>
        {title ? (
          <div className="modal-header px-4">
            <h4 className="modal-title" style={{ margin: 0, padding: 0 }}>
              {title}
            </h4>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
        ) : null}
        <div className="modal-body p-5">{children}</div>
        <div className="modal-footer">
          {onClose !== null ? (
            <Button
              type="button"
              className="btn-secondary-semanggi"
              onClick={onClose}
            >
              Close
            </Button>
          ) : null}
          &nbsp;
          {onSubmit ? (
            <Button
              type="submit"
              className="btn-success-semanggi"
              style={{
                ...onSubmitStyle,
              }}
            >
              {onSubmitTitle ? onSubmitTitle : "Submit"}
            </Button>
          ) : null}
        </div>
      </div>
    )}
  </Modal>
);

FormModal.propTypes = {
  onSubmitTitle: PropTypes.string,
  onSubmitStyle: PropTypes.object,
  onCloseTitle: PropTypes.string,
  onCloseStyle: PropTypes.object,
};
