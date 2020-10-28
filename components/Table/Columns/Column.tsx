import {TableCell} from "@material-ui/core";
import React from "react";
import {ColumnInterface} from "../TableInterface";

export default function Column({align, record, column}: ColumnInterface) {
  return (
    <TableCell align={align}>{record[column]}</TableCell>
  )
}
