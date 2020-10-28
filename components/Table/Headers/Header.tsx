import {
  Box,
  TableCell,
} from "@material-ui/core";
import Sortable from "./Sortable";
import React from "react";

interface HeaderInterface {
  column: string;
  label: string;
  sortable?: boolean;
}

export default function Header({column, label, sortable}: HeaderInterface) {
  return <TableCell>
    <Box display="flex">
      <Box p={1} flexGrow={1} alignSelf="flex-end">
        {label}
      </Box>
      {sortable && <Sortable column={column}/>}
    </Box>
  </TableCell>;
}
