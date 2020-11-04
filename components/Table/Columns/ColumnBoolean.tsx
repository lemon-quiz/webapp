import {TableCell} from "@material-ui/core";
import React from "react";
import {ColumnInterface} from "../TableInterface";
import {Done} from "@material-ui/icons";

export default function ColumnBoolean({align, record, column}: ColumnInterface) {
  return (
    <TableCell align={align}>{record[column] ? <Done/> : null}</TableCell>
  )
}
