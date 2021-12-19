import React, { useState, useEffect, useRef } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import { matchSorter } from "match-sorter";
import { motion } from "framer-motion";

const Table = ({
  data,
  totalData = 0,
  columns,
  loading,
  filterable = false,
  showGlobalFilter = false,
  hideHeader = false,
  fetchData,
  onRemove,
  onEdit,
  onRowClick,
  headerTitle,
  customHeaderButton,
  customUtilities,
  headerContentRight,
  onChangeSelection,
  pageCount: controlledPageCount,
}) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const [filterVisible, setFilterVisible] = useState(false);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,

    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: fetchData ? true : false,
      manualSortBy: fetchData ? true : false,
      autoResetPage: fetchData ? false : true,
      autoResetSortBy: fetchData ? false : true,
      pageCount: controlledPageCount,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        let finalColumns = [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ];
        if (onEdit || customUtilities) {
          finalColumns.push({
            id: "options",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => <div></div>,
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateOptions
                  row={row}
                  onEdit={onEdit}
                  customUtilities={customUtilities || []}
                />
              </div>
            ),
          });
        }
        return finalColumns;
      });
    }
  );

  if (onChangeSelection) {
    useEffect(() => {
      // if (onChangeSelection) {
      onChangeSelection({ rows: selectedFlatRows.map((r) => r.original) });
      // }
    }, [selectedFlatRows.length]);
  }
  if (fetchData) {
    useEffect(() => {
      fetchData({ pageIndex, pageSize, sortBy });
    }, [fetchData, pageIndex, pageSize, sortBy]);
  }

  return (
    <div
      style={{ borderRadius: "10px" }}
      className="bg-white d-flex flex-row flex-wrap text-lg"
    >
      {!hideHeader ? (
        <div className="px-3 py-4 w-100 d-flex flex-col-reverse flex-row flex-wrap">
          {headerTitle ? headerTitle : null}
          <div className="w-50 d-flex flex-row align-items-center">
            {filterable === false ? null : (
              <div className="w-25 px-2 pr-0 md:pr-2">
                <button
                  style={{
                    backgroundColor: "#adb7be",
                    color: "#fff",
                  }}
                  className={
                    "btn btn-block py-2 btn-sm rounded" +
                    (filterVisible ? "" : " btn-soft")
                  }
                  type="button"
                  onClick={(e) => {
                    if (e) e.preventDefault();
                    setFilterVisible(!filterVisible);
                  }}
                >
                  <i className="fa fa-filter" /> Filter
                </button>
              </div>
            )}

            {customHeaderButton ? customHeaderButton : null}
            {onRemove ? (
              <button
                className="w-50 sm:w-auto btn btn-danger btn-soft btn-sm ml-3"
                disabled={selectedFlatRows.length === 0}
                onClick={(e) => {
                  if (e) e.preventDefault();
                  if (onRemove) {
                    onRemove({ rows: selectedFlatRows.map((r) => r.original) });
                  }
                }}
              >
                <i className="fa fa-trash" /> Hapus Terpilih
              </button>
            ) : null}
          </div>
          <div className="w-50 d-flex flex-row align-items-center">
            {headerContentRight ? headerContentRight : null}
          </div>
          {showGlobalFilter ? (
            <div className="w-50 mb-4 sm:mb-0">
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
                loading={loading}
              />
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="w-100 overflow-x-auto">
        <table
          {...getTableProps()}
          style={{
            backgroundColor: "#f2f4f5",
          }}
          className="w-100 overflow-scroll md:overflow-x-hidden overflow-y-visible"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  const headerProps = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );

                  return (
                    <th
                      className={
                        "pt-4 pb-3 px-6 font-bold bg-transparent text-dark text-md text-left " +
                        (column.headerClassName || "")
                      }
                      style={{
                        width:
                          column.id === "selection"
                            ? 20
                            : column.id === "options"
                            ? 50
                            : null,
                        paddingLeft:
                          column.id === "selection"
                            ? 25
                            : column.id === "options"
                            ? 10
                            : 25,
                        paddingRight:
                          column.id === "selection"
                            ? 10
                            : column.id === "options"
                            ? 25
                            : 25,
                        ...column.style,
                      }}
                      key={headerProps.key}
                    >
                      <div
                        {...headerProps}
                        className="d-flex flex-row"
                        style={{
                          ...column.style,
                          ...headerProps.style,
                        }}
                      >
                        <div className="whitespace-no-wrap text-truncate">
                          {column.render("Header")}
                        </div>
                        {column.id === "selection" ||
                        column.id === "options" ||
                        !column.canFilter ? null : (
                          <div className="text-secondary pl-2">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <i className="fa fa-sort-down" />
                              ) : (
                                <i className="fa fa-sort-up" />
                              )
                            ) : (
                              <i className="fa fa-sort" />
                            )}
                          </div>
                        )}
                      </div>
                      {column.canFilter && filterVisible
                        ? column.render("Filter")
                        : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className={"transition duration-500 " + (loading ? "hidden" : "")}
          >
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={(e) => {
                    if (e) {
                      if (
                        e.target.type === "checkbox" &&
                        e.target.title === "Toggle Row Selected"
                      ) {
                      } else if (onRowClick) {
                        e.preventDefault();
                        e.stopPropagation();
                        onRowClick({
                          ...e,
                          row,
                        });
                      }
                    }
                  }}
                  className="transition duration-100 ease-linear border-b border-gray-300 bg-white hover:bg-gray-100 text-secondary cursor-pointer"
                  style={{
                    borderBottom: "1px solid #4a556840",
                  }}
                >
                  {row.cells.map((cell) => (
                    <td
                      className="px-6"
                      {...cell.getCellProps()}
                      style={{
                        width:
                          cell.column.id === "selection"
                            ? 20
                            : cell.column.id === "options"
                            ? 40
                            : null,
                        paddingLeft:
                          cell.column.id === "selection"
                            ? 25
                            : cell.column.id === "options"
                            ? 10
                            : 25,
                        paddingRight:
                          cell.column.id === "selection"
                            ? 10
                            : cell.column.id === "options"
                            ? 25
                            : 25,
                        paddingTop: "2.5rem",
                        paddingBottom: "2.5rem",
                        ...cell.column.style,
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="position-relative w-100">
        <div
          className={
            "position-absolute transition duration-500 bg-white opacity-100 w-100 ease-in-out " +
            (loading ? "visible" : "invisible")
          }
        >
          <div className="pt-6 pb-12 text-center">
            <div className="text-xl text-gray-500 text-bold">
              <i className="fa fa-circle-notch fa-spin" /> SEDANG MEMUAT ...
            </div>
          </div>
        </div>
        <div className="py-4 px-6 d-flex flex-row flex-wrap justify-content-end">
          {/* <div className="w-25 text-center sm:text-left py-1">
            <label>Menuju halaman: </label>
            <input
              style={{
                borderWidth: "2px",
                borderColor: "#e2e8f0",
                borderStyle: "solid",
                outline: "none",
                width: 70,
              }}
              className="rounded ml-2 px-2 py-1"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </div> */}
          <div className="w-25 text-center sm:text-right py-1">
            <label className="text-semanggi-gray" htmlFor="#rowPerPage">
              Rows per page:{" "}
            </label>
            &nbsp;
            <label
              style={{
                border: "none",
              }}
              className="rounded px-2 py-1"
            >
              <select
                style={{
                  border: "none",
                  appearance: "none",
                  background: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                className="outline-none py-1"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              &#9662;
            </label>
          </div>
          <div className="d-flex justify-content-center align-items-center w-25 text-center">
            <span className="text-semanggi-gray">
              {pageIndex + 1 === controlledPageCount
                ? pageSize * pageIndex +
                  1 +
                  " - " +
                  totalData +
                  " of " +
                  totalData
                : pageSize * pageIndex +
                  1 +
                  " - " +
                  (pageSize * pageIndex + pageSize) +
                  " of " +
                  totalData}
            </span>
            <button
              className="btn btn-gray p-0 mr-2 pl-4"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              &nbsp;
              <i
                style={{ fontSize: "2rem" }}
                className={
                  "fa fa-angle-left " +
                  (canPreviousPage ? "text-gray-500" : "text-gray-300")
                }
              />
              &nbsp;
            </button>

            <button
              style={{ fontSize: "2rem" }}
              className="btn btn-gray p-0 ml-2 pl-4"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              &nbsp;
              <i
                className={
                  "fa fa-angle-right " +
                  (canNextPage ? "text-gray-500" : "text-gray-300")
                }
              />
              &nbsp;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    );
  }
);

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

const IndeterminateOptions = (props) => {
  const ref = useRef();
  const [optionsVisible, setOptionsVisible] = useState(false);
  useOnClickOutside(ref, () => setOptionsVisible(false));

  return (
    <div className="w-100">
      <a
        href="#"
        className="px-2 text-gray-500"
        onClick={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setOptionsVisible(!optionsVisible);
        }}
      >
        <i className="fa fa-ellipsis-v" />
      </a>
      <div className="d-flex flex-row-reverse position-relative" ref={ref}>
        <div
          className={
            "position-absolute bg-white border border-gray-400 mr-2 rounded text-sm text-secondary transition duration-300 ease-in-out z-20 whitespace-no-wrap opacity-100" +
            (optionsVisible ? " d-block" : " hidden")
          }
        >
          <div className="px-2 py-1 text-xs text-gray-600">
            <b>Utilitas</b>
          </div>
          {props.onEdit ? (
            <a
              className="d-block px-4 py-2 border-t bg-white hover:bg-gray-100"
              href="#"
              onClick={(e) => {
                if (e) e.preventDefault();
                props.onEdit({ row: props.row.original });
                setOptionsVisible(false);
              }}
            >
              <i className="fa fa-pencil-alt" /> &nbsp; Edit
            </a>
          ) : null}
          {props.customUtilities.map((utility, index) =>
            utility.render ? (
              <div
                key={index}
                className="d-block border-t bg-white hover:bg-gray-100"
              >
                {utility.render(props)}
              </div>
            ) : (
              <a
                key={index}
                className="d-block px-4 py-2 border-t bg-white hover:bg-gray-100"
                href="#"
                onClick={(e) => {
                  if (e) e.preventDefault();
                  if (utility.onClick) {
                    utility.onClick({ ...e, ...props });
                  }
                  setOptionsVisible(false);
                }}
              >
                {utility.icon ? <span>{utility.icon} &nbsp;</span> : ""}
                {utility.label}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  loading,
}) {
  const [state, setState] = useState("blur");
  //  const count = preGlobalFilteredRows.length;

  return (
    <motion.div
      initial="blur"
      variants={{
        focus: {
          backgroundColor: "rgba(255, 255, 255)",
        },
        blur: {
          backgroundColor: "#fff",
        },
      }}
      animate={state}
      onFocus={(e) => {
        setState("focus");
      }}
      onBlur={(e) => {
        setState("blur");
      }}
      className="rounded-full border-2 border-gray-300 px-2 py-2 d-flex flex-row w-75"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #DFE0EB",
        borderRadius: "8px",
      }}
    >
      <div className="py-1 px-2">
        <i
          className={
            "transition-all duration-500 transform " +
            (state === "focus"
              ? " text-gray-800 scale-100"
              : " text-gray-600 scale-95") +
            " " +
            (!loading ? "fa fa-search" : "fa fa-circle-notch fa-spin")
          }
        />
      </div>
      <input
        className="py-1 px-1 flex-grow w-100"
        style={{
          outline: "none",
          border: "none",
        }}
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Find Data`}
      />
    </motion.div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function DefaultColumnFilter({ column }) {
  const { filterValue, preFilteredRows, setFilter } = column;
  // const count = preFilteredRows.length;

  return (
    <div>
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        className={
          "rounded form-control text-black px-2 mt-1 py-1 w-100 outline-none " +
          (column.headerClassName || "")
        }
        //placeholder={"Filter " + column.Header}
      />
    </div>
  );
}
