import { getTime, getDateColor } from "commonMethod/common";
import CategoryChip from "./categoryChips";

export const makeTableColumns = (
  columns,
  filterData,
  handleMultiSelect,
  handleChecked
) => {
  let productColumn = [];
  let productCheckbox = {
    width: 100,
    accessor: "check",
    Header: (
      <input
        type="checkbox"
        name="multi-select-box"
        disabled={filterData.length === 0}
        checked={handleChecked()}
        onChange={handleMultiSelect}
      />
    ),
    sortable: false,
    filterable: false,
  };
  productColumn.push(productCheckbox);
  columns.forEach((item) => {
    let tableColumn;
    if (item.checked) {
      if (item.header === "Name") {
        tableColumn = {
          // width: 150,
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => <div>{row._original.name}</div>,
        };
      } else if (item.header === "Status") {
        tableColumn = {
          width: 120,
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => (
            <span>{row._original.isActive ? "Active" : "In-Active"}</span>
          ),
        };
      } else if (item.header === "Next Expiry") {
        tableColumn = {
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => (
            <span
              className={
                row._original.expiryDate &&
                (getDateColor(row._original.expirationDate, 2)
                ? "expiryRed"
                : getDateColor(row._original.expirationDate, 5)
                    ? "expiryYellow"
                    : "expiryBlack")
              }
            >
              {row._original.expiryDate &&
                getTime(row._original.expiryDate)}
            </span>
          ),
        };
      } else if (item.header === "Categories") {
        tableColumn = {
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => {
            return row._original.productCategory.map((item) => (
              <CategoryChip name={item.name} />
            ));
          },
        };
      } else if (item.header === "BadgeEPC") {
        tableColumn = {
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => (
            <span>
              {row._original && row._original.badgeEPC && row._original.badgeEPC.itemEPC}
            </span>
          )
        };
      } else if (item.header === "Avatar") {
        tableColumn = {
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => (
            <span className="table-image">
              {row._original.avatar ? (
                <img src={row._original.avatar} />
              ) : (
                <img src="https://fakeimg.pl/640x360"></img>
              )}
            </span>
          ),
        };
      } else if (item.header === "Signature") {
        tableColumn = {
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => (
            <span className="table-image">
              {row._original.avatar ? (
                <img src={row._original.signature} />
              ) : (
                <img src="https://fakeimg.pl/640x360"></img>
              )}
            </span>
          ),
        };
      } else if (item.header === "Image") {
        tableColumn = {
          width: 120,
          Header: item.header,
          accessor: item.accessor,
          Cell: ({ row }) => (
            <span className="table-image">
              {row._original.image ? (
                <img src={row._original.image} />
              ) : (
                <img src="https://fakeimg.pl/640x360"></img>
              )}
            </span>
          ),
        };
      } else {
        tableColumn = {
          // width: 120,
          className: "column_width",
          Header: item.header,
          accessor: item.accessor,
        };
      }
      productColumn.push(tableColumn);
    }
  });
  return productColumn;
};
