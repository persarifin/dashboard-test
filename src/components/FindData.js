import React from "react";
import PropTypes from "prop-types";

const FindData = ({ onChange, placeholder, value }) => {
  return (
    <div className="rounded-full border-2 border-gray-300 px-2 py-2 d-flex flex-row w-100 find-data">
      <div className="py-1 px-2">
        <i className="transition-all duration-500 transform text-gray-600 scale-95 fa fa-search"></i>
      </div>
      <input
        className="py-1 px-1 flex-grow w-75"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

FindData.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
};

FindData.defaultProps = {
  placeholder: "Find Data"
}

export default FindData;