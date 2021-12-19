import * as React from "react";
import Select from "react-select";

const CustomSelect = (props) => {
  return (
    <>
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
        {...props}
      />
    </>
  );
};
export default CustomSelect;
