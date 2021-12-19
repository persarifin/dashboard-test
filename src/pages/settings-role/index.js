import * as React from "react";
import { Card, Col, Row, Form, Button, Modal } from "react-bootstrap";
import Layout, {
  showLoadingSpinner,
  hideLoadingSpinner,
} from "../../components/Layout";
import DataTable2 from "../../components/DataTable2";
import { connect, dispatch } from "react-redux";
import {
  getRole,
  storeRole,
  updateRole,
  destroyRole,
} from "redux/actions/role";
import { getPermissions } from "redux/actions/permission";
import Confirm from "../../components/Confirm";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Select from "react-select";
import { currentUserDontHaveRoles } from "libs/rolePermission";

let selectAllRef = React.createRef();

const listTables = [
  {
    value: "billing_counters",
    label: "Billing Counters",
  },
  {
    value: "billing_invoices",
    label: "Billing Invoices",
  },
  {
    value: "compan",
    label: "Companies",
  },
  {
    value: "company_wallet",
    label: "Company Wallets",
  },
  {
    value: "content_visibilit",
    label: "Content Visibilities",
  },
  {
    value: "content categor",
    label: "Content Categories",
  },
  {
    value: "content",
    label: "Contents",
  },
  {
    value: "interface",
    label: "Interfaces",
  },
  {
    value: "notification_activations",
    label: "Notification Activations",
  },
  {
    value: "notification_topics",
    label: "Notification Topics",
  },
  {
    value: "payment_reconciliation",
    label: "Payment Reconciliations",
  },
  {
    value: "payment_transaction",
    label: "Payment Transactions",
  },
  {
    value: "product categor",
    label: "Product Categories",
  },
  {
    value: "product",
    label: "Products",
  },
  {
    value: "role",
    label: "Roles",
  },
  {
    value: "schedule",
    label: "Schedules",
  },
  {
    value: "submission categor",
    label: "Submission Categories",
  },
  {
    value: "submission",
    label: "Submissions",
  },
  {
    value: "user_wallet",
    label: "User Wallets",
  },
  {
    value: "user",
    label: "Users",
  },
];

const FormEditRoles = ({
  formData,
  selectedCategoryPermission,
  selectedPermissions,
  permissions,
  selectAllRef,
  countSelectedPermissions,
  handleInput,
  handleChangeCategoryPermission,
  handleSelectPermission,
  handleSelectAllPermissions,
}) => (
  <div>
    <Row>
      <Col xs="4" className="pt-1">
        <strong>Role Name</strong>
      </Col>
      <Col xs="5">
        <Form.Control
          type="text"
          onChange={handleInput}
          value={formData.name}
          size={"lg"}
          placeholder="Role Name"
        />
      </Col>
    </Row>
    <Row className="pt-3">
      <Col xs="4" className="pt-1">
        <strong>Permission</strong>
      </Col>
      <Col xs="5">
        <Select
          styles={{
            menuList: (provided) => {
              return {
                ...provided,
                backgroundColor: "#fff",
              };
            },
            control: (base, state) => ({
              ...base,
              "&:hover": { borderColor: "#0daa66" },
              border: state.isFocused ? "1px solid #0daa66" : "1px solid #ccc",
              boxShadow: "none",
            }),
          }}
          options={listTables}
          placeholder="Select Category"
          onChange={handleChangeCategoryPermission}
        />
      </Col>
    </Row>
    {selectedCategoryPermission ? (
      <>
        <Row className="pt-3">
          <Col
            xs="12"
            style={{ borderRadius: "10px", background: "#ededed" }}
            className="p-3"
          >
            <Row>
              <Col xs="8">
                <strong>{selectedCategoryPermission}</strong>
              </Col>
              {permissions.length > 0 ? (
                <Col xs="4" style={{ textAlign: "right" }}>
                  <label
                    className="custom-checkbox"
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#ededed",
                    }}
                  >
                    <b>Select All</b>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllPermissions(permissions)}
                      ref={selectAllRef}
                      checked={
                        countSelectedPermissions[selectedCategoryPermission] ===
                        permissions.length
                          ? true
                          : false
                      }
                    />
                    <span className="checkmark"></span>
                  </label>
                </Col>
              ) : null}
            </Row>
            <Row>
              <Col xs="12">
                <hr />
              </Col>
            </Row>
            <Row>
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <Col xs={3} key={permission.id}>
                    <label
                      className="custom-checkbox"
                      style={{
                        fontSize: "12px",
                        backgroundColor: "#ededed",
                      }}
                    >
                      {permission.name}
                      <input
                        type="checkbox"
                        onChange={handleSelectPermission}
                        value={permission.id}
                        checked={
                          selectedPermissions[permission.id]
                            ? selectedPermissions[permission.id]
                            : false
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
                  </Col>
                ))
              ) : (
                <Col>
                  <p>
                    Permission <b>{selectedCategoryPermission}</b> Not Found
                  </p>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </>
    ) : null}
    <p className="mt-2" style={{ fontStyle: "italic" }}>
      Total {Object.keys(selectedPermissions).length} permissions selected
    </p>
  </div>
);

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customStyles: {
        rows: {
          style: {
            cursor: "pointer",
          },
        },
      },
      loading: true,
      createModalVisible: false,
      editModalVisible: false,
      tabIndex: -1,
      dataDelete: null,

      selectedCategoryPermission: "",
      selectedPermissions: {},
      countSelectedPermissions: {},

      formData: {
        name: "",
      },
      paginationRole: {
        pageCount: 0,
      },

      getRoleOpts: {
        params: {
          "page[limit]": 10,
          "page[num]": 1,
          "filter[custom_name][not]": "verified",
        },
      },
    };
  }

  columns = [
    {
      Header: "Role Name",
      accessor: "custom_name",
    },
    {
      Header: "Total Permissions",
      accessor: "",
      Cell: (props) => (
        <span>
          {props.cell.row.original.relationships.permissions
            ? props.cell.row.original.relationships.permissions.length
            : "0"}
        </span>
      ),
    },
    {
      Header: "Last Updated",
      accessor: "updated_at",
      Cell: (props) => (
        <span>{dayjs(props.value).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
    {
      Header: "Action",
      accessor: "",
      Cell: (props) => {
        return !currentUserDontHaveRoles(["enterprise"]) ? (
          <div>
            <img
              className="mr-2"
              style={{ width: "15px", cursor: "pointer" }}
              src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/border-color-24px.png"
              onClick={() =>
                this.editData(props.cell.row.original, props.cell.row.id)
              }
            />
            <img
              style={{ width: "15px", cursor: "pointer" }}
              src="https://storage.googleapis.com/spaces-semanggi-app/back-office/super-entity/png/delete.png"
              onClick={() =>
                this.setState({
                  modalDelete: true,
                  dataDelete: props.cell.row.original,
                  tabIndex: props.cell.row.id,
                })
              }
            />
          </div>
        ) : null;
      },
    },
  ];

  async editData(rowData, index) {
    const roleIncluded = this.props.roleIncluded;
    const includedPermissions =
      roleIncluded && roleIncluded.permissions ? roleIncluded.permissions : [];
    const { relationships } = rowData;
    const permissions = relationships.permissions;
    const indexedPermissions = permissions.reduce((all, permission) => {
      all[permission.id] = true;
      return all;
    }, {});

    const filteredPermissions = permissions.map((permission) => {
      if (includedPermissions[permission.id]) {
        return includedPermissions[permission.id].attributes;
      }
    });

    const countSelectedPermissions = listTables.reduce((all, tabel) => {
      all[tabel.value] = filteredPermissions.filter((permission) => {
        const pattern = `.*${tabel.value}.*`;
        const regexPattern = new RegExp(pattern, "g");
        return permission.name.match(regexPattern);
      }).length;
      return all;
    }, {});
    this.setState({
      editModalVisible: true,
      editedPermissions: indexedPermissions,
      selectedPermissions: indexedPermissions,
      selectedCategoryPermission: "",
      formData: {
        ...rowData.attributes,
        name: rowData.custom_name,
      },
      countSelectedPermissions,
    });
  }

  componentDidMount() {
    // const { getRoleOpts } = this.state;
    //this.props.getRole(getRoleOpts);
    this.props.getPermissions({
      params: {
        "page[limit]": 10,
      },
    });
  }

  handleInput = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        name: e.target.value,
      },
    });
  };

  handleChangeCategoryPermission = async (e) => {
    showLoadingSpinner();
    let param = {
      "page[limit]": 500,
      "filter[name][like]": e.value,
    }
    if (e.label === 'Submissions' || e.label === 'Products' || e.label === 'Contents') {
      param = {
        "page[limit]": 500,
        "filter[name][like]": e.value,
        "filter[name][not_like]": "categories"
      }
    }
    else if(e.label === 'Companies'){
      param = {
        "page[limit]": 500,
        "filter[name][like]": e.value,
        "filter[name][not_like]": "wallet"
        // "filter[name][not_like]": "interface",
        // "filter[name][not_like]": "user"
      }
    }
    else if(e.label === 'Users'){
      param = {
        "page[limit]": 500,
        "filter[name][like]": e.value,
        "filter[name][not_like]": "wallet"
      }
    }
    await this.props.getPermissions({
      params : param
    });

    const { countSelectedPermissions } = this.state;

    if (selectAllRef.current) {
      if (this.props.permissions.length === countSelectedPermissions[e.value]) {
        selectAllRef.current.checked = true;
        hideLoadingSpinner();
        return;
      }
      selectAllRef.current.checked = false;
    }

    this.setState({
      selectedCategoryPermission: e.label,
    });

    hideLoadingSpinner();
  };

  handleSelectPermission = (e) => {
    const { countSelectedPermissions, selectedCategoryPermission } = this.state;
    let newSelectedPermissions = this.state.selectedPermissions;
    let newCountSelectedPermissions = countSelectedPermissions;

    if (e.target.checked) {
      newSelectedPermissions[e.target.value] = true;
      if (
        newCountSelectedPermissions[selectedCategoryPermission] &&
        newCountSelectedPermissions[selectedCategoryPermission] !== ""
      ) {
        newCountSelectedPermissions[selectedCategoryPermission] += 1;
      } else {
        newCountSelectedPermissions[selectedCategoryPermission] = 1;
      }
      this.setState({
        countSelectedPermissions: newCountSelectedPermissions,
      });
    } else {
      delete newSelectedPermissions[e.target.value];
      if (
        newCountSelectedPermissions[selectedCategoryPermission] &&
        newCountSelectedPermissions[selectedCategoryPermission] !== ""
      ) {
        newCountSelectedPermissions[selectedCategoryPermission] -= 1;
      } else {
        newCountSelectedPermissions[selectedCategoryPermission] = 0;
      }
      this.setState({
        countSelectedPermissions: newCountSelectedPermissions,
      });
    }

    this.setState({
      selectedPermissions: newSelectedPermissions,
    });
  };

  handleSelectAllPermissions = (permissions) => (e) => {
    const {
      countSelectedPermissions,
      selectedCategoryPermission,
      selectedPermissions,
    } = this.state;
    const indexedPermissions = permissions.reduce((all, permission) => {
      all[permission.id] = true;
      return all;
    }, {});
    if (e.target.checked) {
      Object.assign(selectedPermissions, indexedPermissions);
      countSelectedPermissions[selectedCategoryPermission] = permissions.length;
      this.setState({
        selectedPermissions,
        countSelectedPermissions,
      });
    } else {
      Object.keys(selectedPermissions).map((permission) => {
        if (
          selectedPermissions[permission] === indexedPermissions[permission]
        ) {
          delete selectedPermissions[permission];
        }
      });
      countSelectedPermissions[selectedCategoryPermission] = 0;
      this.setState({
        selectedPermissions,
        countSelectedPermissions,
      });
    }
  };

  handleSubmitRole = async (e) => {
    if (e) e.preventDefault();
    const { getRoleOpts } = this.state;
    const permissionIds = Object.keys(this.state.selectedPermissions);

    if (permissionIds.length < 1) {
      return toast.error("Permission tidak boleh kosong!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }

    showLoadingSpinner();

    await this.props.storeRole({
      ...this.state.formData,
      permission_ids: permissionIds,
    });

    await this.props.getRole(getRoleOpts);

    hideLoadingSpinner();

    this.setState({
      createModalVisible: false,
    });
  };

  handleUpdateRole = async (e) => {
    if (e) e.preventDefault();

    const { getRoleOpts } = this.state;
    const permissionIds = Object.keys(this.state.selectedPermissions);

    if (permissionIds.length < 1) {
      return toast.error("Permission tidak boleh kosong!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }

    showLoadingSpinner();
    try {
      await this.props.updateRole({
        ...this.state.formData,
        permission_ids: permissionIds,
      });

      // await this.props.getRole(getRoleOpts);
    } catch (e) {
      //
    }

    hideLoadingSpinner();

    // this.setState({
    //   editModalVisible: false,
    // });
  };

  handleDeleteRole = async () => {
    const role = this.state.dataDelete.attributes;

    showLoadingSpinner();

    await this.props.destroyRole(role.id);

    this.setState({
      modalDelete: false,
    });

    hideLoadingSpinner();
  };

  fetchData = async ({ pageSize, pageIndex, sortBy }) => {
    showLoadingSpinner();

    let getRoleOpts = {
      params: {
        "page[limit]": pageSize,
        "page[num]": pageIndex + 1,
        "filter[custom_name][not]": "verified",
        "sort": 'custom_name',
        include: "permissions",
      },
    };

    this.setState({
      getRoleOpts
    });

    const { roleMeta } = this.props;
    
    await this.props.getRole(getRoleOpts);
    
    this.setState({
      paginationRole: {
        pageCount: Math.ceil(roleMeta.pagination.total / pageSize),
      },
    });
    
    hideLoadingSpinner();
  };

  render() {
    const { createModalVisible, editModalVisible, formData } = this.state;
    const { permissions = [], roleMeta } = this.props;
    return (
      <Layout title="User Role" classname="dashboard theme-light">
        {this.state.dataDelete && (
          <Confirm
            title="Delete Role"
            body={
              <div>
                <small>
                  Are you sure you want to Delete User Role with the folowing
                  details:{" "}
                </small>
                <div
                  style={{
                    background: "#F7F8FC",
                    borderRadius: "15px",
                    marginTop: "20px",
                    padding: "10px 10px 10px 10px",
                  }}
                >
                  <table>
                    <tbody>
                      <tr>
                        <th width="100px">
                          <small>Role Name</small>
                        </th>
                        <td>
                          <small>:</small>
                        </td>
                        <td>
                          <small>
                            {this.state.dataDelete.custom_name}
                          </small>
                        </td>
                      </tr>
                      <tr>
                        <th width="100px">
                          <small>Total Permission</small>
                        </th>
                        <td>
                          <small>:</small>
                        </td>
                        <td>
                          <small>
                            {
                              this.state.dataDelete.relationships.permissions
                                .length
                            }
                          </small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }
            show={this.state.modalDelete}
            deleteData={this.handleDeleteRole}
            onHide={() => this.setState({ modalDelete: false })}
          />
        )}

        <Modal
          onHide={() =>
            this.setState({
              createModalVisible: false,
            })
          }
          show={createModalVisible}
          size="lg"
          backdrop="static"
          keyboard={false}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton style={{ border: "0" }}>
            <Modal.Title id="contained-modal-title-vcenter">
              Create User Role
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-5">
            <Row>
              <Col xs="4" className="pt-1">
                <strong>Role Name</strong>
              </Col>
              <Col xs="5">
                <Form.Control
                  type="text"
                  onChange={this.handleInput}
                  value={formData.name}
                  size={"lg"}
                  placeholder="Role Name"
                />
              </Col>
            </Row>

            <Row className="pt-3">
              <Col xs="4" className="pt-1">
                <strong>Permission</strong>
              </Col>
              <Col xs="5">
                <Select
                  styles={{
                    menuList: (provided) => {
                      return {
                        ...provided,
                        backgroundColor: "#fff",
                      };
                    },
                    control: (base, state) => ({
                      ...base,
                      "&:hover": { borderColor: "#0daa66" },
                      border: state.isFocused
                        ? "1px solid #0daa66"
                        : "1px solid #ccc",
                      boxShadow: "none",
                    }),
                    option: (
                      styles,
                      { data, isDisabled, isFocused, isSelected }
                    ) => {
                      return {
                        ...styles,
                        backgroundColor: isDisabled
                          ? null
                          : isSelected
                          ? data.color
                          : isFocused
                          ? "#D9FCED"
                          : null,
                        color: isFocused ? "#0DAA66" : data.color,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        ":active": {
                          ...styles[":active"],
                          backgroundColor:
                            !isDisabled &&
                            (isSelected ? data.color : "#D9FCED"),
                        },
                      };
                    },
                  }}
                  options={listTables}
                  placeholder="Select Category"
                  onChange={this.handleChangeCategoryPermission}
                />
              </Col>
            </Row>
            {this.state.selectedCategoryPermission ? (
              <>
                <Row className="pt-3">
                  <Col
                    xs="12"
                    style={{ borderRadius: "10px", background: "#ededed" }}
                    className="p-3"
                  >
                    <Row>
                      <Col xs="8">
                        <strong>{this.state.selectedCategoryPermission}</strong>
                      </Col>
                      {permissions.length > 0 ? (
                        <Col xs="4" style={{ textAlign: "right" }}>
                          <label
                            className="custom-checkbox"
                            style={{
                              fontSize: "12px",
                              backgroundColor: "#ededed",
                            }}
                          >
                            <b>Select All</b>
                            <input
                              type="checkbox"
                              onChange={this.handleSelectAllPermissions(
                                permissions
                              )}
                              ref={selectAllRef}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      <Col xs="12">
                        <hr />
                      </Col>
                    </Row>
                    <Row>
                      {permissions.length > 0 ? (
                        permissions.map((permission) => (
                          <Col xs={3} key={permission.id}>
                            <label
                              className="custom-checkbox"
                              style={{
                                fontSize: "12px",
                                backgroundColor: "#ededed",
                              }}
                            >
                              {permission.name}
                              <input
                                type="checkbox"
                                onChange={this.handleSelectPermission}
                                value={permission.id}
                                checked={
                                  this.state.selectedPermissions[permission.id]
                                    ? this.state.selectedPermissions[
                                        permission.id
                                      ]
                                    : false
                                }
                              />
                              <span className="checkmark"></span>
                            </label>
                          </Col>
                        ))
                      ) : (
                        <Col>
                          <p>
                            Permission{" "}
                            <b>{this.state.selectedCategoryPermission}</b> Not
                            Found
                          </p>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
                <p className="mt-2" style={{ fontStyle: "italic" }}>
                  Total {Object.keys(this.state.selectedPermissions).length}{" "}
                  permissions selected
                </p>
              </>
            ) : null}
          </Modal.Body>
          <Modal.Footer style={{ border: "0" }}>
            <Button
              className="btn-secondary-semanggi"
              onClick={() =>
                this.setState({
                  createModalVisible: false,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmitRole}
              className="btn-success-semanggi"
            >
              CREATE
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          onHide={() =>
            this.setState({
              editModalVisible: false,
            })
          }
          show={editModalVisible}
          size="lg"
          backdrop="static"
          keyboard={false}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton style={{ border: "0" }}>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit User Role
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-5">
            <FormEditRoles
              formData={formData}
              selectedCategoryPermission={this.state.selectedCategoryPermission}
              selectedPermissions={this.state.selectedPermissions}
              countSelectedPermissions={this.state.countSelectedPermissions}
              permissions={permissions}
              selectAllRef={selectAllRef}
              handleInput={this.handleInput}
              handleChangeCategoryPermission={
                this.handleChangeCategoryPermission
              }
              handleSelectPermission={this.handleSelectPermission}
              handleSelectAllPermissions={this.handleSelectAllPermissions}
            />
          </Modal.Body>
          <Modal.Footer style={{ border: "0" }}>
            <Button
              className="btn-secondary-semanggi"
              onClick={() =>
                this.setState({
                  editModalVisible: false,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleUpdateRole}
              className="btn-success-semanggi"
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>
        {/* DataTable */}
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card style={{ backgroundColor: "white", borderRadius: "10px" }}>
              <Row
                className="position-relative show-grid"
                style={{ margin: "20px 20px 0px 20px" }}
              >
                <Col xs={12}>
                  <Form>
                    <Form.Row className="align-items-center">
                      <Col xs="12" style={{ textAlign: "right" }}>
                        <Button
                          className="btn-success-semanggi"
                          onClick={() =>
                            this.setState({
                              createModalVisible: true,
                              formData: {
                                name: "",
                              },
                              selectedPermissions: {},
                            })
                          }
                        >
                          CREATE NEW ROLE
                        </Button>
                      </Col>
                    </Form.Row>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <DataTable2
                    data={this.props.data}
                    totalData={
                      this.props.roleMeta && this.props.roleMeta.pagination
                        ? this.props.roleMeta.pagination.total
                        : 0
                    }
                    columns={this.columns}
                    loading={this.props.loading}
                    filterable={false}
                    fetchData={this.fetchData}
                    pageCount={this.state.paginationRole.pageCount}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { data, included, meta } = state.role;
  const { permissions } = state.permission;
  const { loading } = state.loader;
  return {
    loading,
    data: data,
    roleIncluded: included,
    roleMeta: meta,
    permissions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRole: (opts) => dispatch(getRole(opts)),
    storeRole: (payload) => dispatch(storeRole(payload)),
    updateRole: (payload) => dispatch(updateRole(payload)),
    destroyRole: (id) => dispatch(destroyRole(id)),
    getPermissions: (opts) => dispatch(getPermissions(opts)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Index);
