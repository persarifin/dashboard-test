import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  FormControl,
  Button,
  Table,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { formatCurrency } from "libs/numbers";
import SelectDuration from "components/SelectDuration";
import Calendar from "react-calendar";
import dayjs from "dayjs";
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import { getProduct } from "redux/actions/product";
import {
  getProductSchedulesPerDay,
  selectDateSchedule,
  selectRentTime,
  deselectRentTime,
} from "redux/actions/product_schedule";
// import { showLoadingSpinner, hideLoadingSpinner } from "./Layout";

const listDurationTime = [
  // Pagi
  "01.00 - 02.00",
  "02.00 - 03.00",
  "03.00 - 04.00",
  "04.00 - 05.00",
  "05.00 - 06.00",
  "06.00 - 07.00",
  "07.00 - 08.00",
  "08.00 - 09.00",
  "09.00 - 10.00",
  "10.00 - 11.00",
  "11.00 - 12.00",
  // Siang - Sore
  "12.00 - 13.00",
  "13.00 - 14.00",
  "14.00 - 15.00",
  "15.00 - 16.00",
  "16.00 - 17.00",
  // Malam
  "17.00 - 18.00",
  "18.00 - 19.00",
  "19.00 - 20.00",
  "20.00 - 21.00",
  "21.00 - 22.00",
  "22.00 - 23.00",
  "23.00 - 24.00",
];

class BookPerDay extends Component {
  state = {
    // defaultViewListText: "60 Minutes",
    // viewList: [
    //   { id: "30", name: "30 Minutes" },
    //   { id: "60", name: "60 Minutes" },
    //   { id: "90", name: "90 Minutes" },
    //   { id: "120", name: "120 Minutes" },
    // ],
    calendarValue: new Date(),
    indexedRentTime: {},
    indexedStatusRentTime: {},
  };
  async componentDidMount() {
    // showLoadingSpinner();
    const {
      selectedDateSchedule,
    } = this.props;
    const date =
      selectedDateSchedule && selectedDateSchedule.fullDate
        ? dayjs(selectedDateSchedule.fullDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
    const opts = {
      params: {
        "filter[start][date]": date,
        "filter[product_id][is]": this.props.selectedProduct.id,
      },
    };
    await this.rebuildRentTime(opts);
    const indexedRentTime = listDurationTime.reduce((all, duration) => {
      all[duration] = {
        selected: false,
      };
      return all;
    }, {});
    if (selectedDateSchedule && selectedDateSchedule.fullDate) {
      this.setState({
        calendarValue: dayjs(selectedDateSchedule.fullDate).toDate(),
      });
    } else {
      this.setState({
        calendarValue: new Date(),
      });
    }
    this.setState({
      indexedRentTime,
    });
    // hideLoadingSpinner();
  }
  rebuildRentTime = async (opts) => {
    const schedules = await this.props.getProductSchedulesPerDay(opts);
    const indexedStatusRentTime = {};
    for (const duration of listDurationTime) {
      const splitted = duration.split(" - ");
      const start = dayjs(this.props.selectedDateSchedule.fullDate)
        .startOf("day")
        .hour(parseInt(splitted[0].split(".")[0]))
        .format("YYYY-MM-DD HH:mm:ss");
      const finish = dayjs(this.props.selectedDateSchedule.fullDate)
        .startOf("day")
        .hour(parseInt(splitted[1].split(".")[0]))
        .format("YYYY-MM-DD HH:mm:ss");
      for (const schedule of schedules) {
        if (
          dayjs(start).isSameOrAfter(
            dayjs(schedule.attributes.start),
            "hour"
          ) &&
          dayjs(finish).isSameOrBefore(
            dayjs(schedule.attributes.finish),
            "hour"
          )
        ) {
          indexedStatusRentTime[duration] = "booked";
        }
      }
    }
    this.setState({
      indexedStatusRentTime,
    });
  };
  handleSelectDuration = (e) => {};
  handleChangeCalendar = (e) => {
    this.props.selectDateSchedule({
      fullDate: e,
      dateStr: dayjs(e).format("YYYY-MM-DD HH:mm:ss"),
    });
    const opts = {
      params: {
        "filter[start][date]": dayjs(e).format("YYYY-MM-DD"),
        "filter[product_id][is]": this.props.selectedProduct.id,
      },
    };
    this.rebuildRentTime(opts);
    this.setState({
      calendarValue: e,
    });
  };
  handleSelectRentTime = (duration) => (e) => {
    const { indexedRentTime } = this.state;
    let newIndexedRentTime = indexedRentTime;
    newIndexedRentTime[duration].selected = !newIndexedRentTime[duration]
      .selected;
    if (newIndexedRentTime[duration].selected === true) {
      this.props.selectRentTime(duration);
    } else {
      this.props.deselectRentTime(duration);
    }
    this.setState({
      indexedRentTime: newIndexedRentTime,
    });
  };
  render() {
    const { indexedRentTime, indexedStatusRentTime } = this.state;
    return (
      <>
        <Row className="book-per-day">
          <Col style={{ padding: "0 3rem" }}>
            <Calendar
              firstDayOfWeek={2}
              locale={"en"}
              prev2Label={null}
              next2Label={null}
              prevLabel={<i color="#818181" className="fa fa-angle-left" />}
              nextLabel={<i color="#818181" className="fa fa-angle-right" />}
              onChange={this.handleChangeCalendar}
              value={this.state.calendarValue}
            />
          </Col>
          <Col lg={6} className="content-left">
            {/* <h5 style={{ color: "#3c3c3c" }}>Duration</h5>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#78828A",
              }}
            >
              Select how long you would like to rent the space. Minimum of 30
              minutes.
            </p>
            <div className="form-group mt-4">
              <SelectDuration
                defaultText={this.state.defaultViewListText}
                optionsList={this.state.viewList}
                onChange={this.handleSelectDuration}
              />
            </div> */}
            <h5 style={{ color: "#3c3c3c" }} className="mt-4 mb-0">
              Pick Rent Time
            </h5>
            <div className="pick-rent-container mt-4">
              <Row>
                {Object.keys(indexedRentTime).map((duration) =>
                  indexedStatusRentTime[duration] ? (
                    <Col lg={6} className="mb-2" key={duration}>
                      <div
                        className={`box-time ${indexedStatusRentTime[duration]}`}
                      >
                        <span style={{ userSelect: "none" }}>{duration}</span>
                      </div>
                    </Col>
                  ) : (
                    <Col
                      lg={6}
                      className="mb-2"
                      key={duration}
                      onClick={this.handleSelectRentTime(duration)}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        className={`box-time ${
                          indexedStatusRentTime[duration]
                        } ${
                          indexedRentTime[duration] &&
                          indexedRentTime[duration].selected === true
                            ? "selected"
                            : ""
                        }`}
                      >
                        <span style={{ userSelect: "none" }}>{duration}</span>
                      </div>
                    </Col>
                  )
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => {
//   const { visible } = state.cart;
  const { selectedDateSchedule } = state.productSchedule;
  return {
    // cartVisible: visible,
    selectedDateSchedule,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductSchedulesPerDay: (opts) =>
    dispatch(getProductSchedulesPerDay(opts)),
    getProduct: (payload) => dispatch(getProduct(payload)),
    selectDateSchedule: (payload) => dispatch(selectDateSchedule(payload)),
    selectRentTime: (payload) => dispatch(selectRentTime(payload)),
    deselectRentTime: (payload) => dispatch(deselectRentTime(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BookPerDay);
