import {getDateTime} from "commonMethod/common";

export const UserMovementHistoryColumns = [
  {
    width: 200,
    Header: "Event Time ",
    accessor: "eventTime",
    Cell: ({ row }) => (
      <span>{getDateTime(row._original.eventTime)}</span>
    ),
  },
  {
    width: 200,
    Header: "First Seen ",
    accessor: "firstSeen",
    Cell: ({ row }) => (
      <span>{getDateTime(row._original.firstSeen)}</span>
    ),
  },
  {
    width: 200,
    Header: "Last seen ",
    accessor: "lastSeen",
    Cell: ({ row }) => (
      <span>{getDateTime(row._original.lastSeen)}</span>
    ),
  },
  {
    width: 200,
    Header: "location ",
    accessor: "location",
    Cell: ({ row }) => <span>{row._original.bizLocation.name}</span>,
  },
];
