import {TableCell} from "@material-ui/core";
import React, {useContext, useMemo, useState} from "react";
import {ColumnDateInterface} from "../TableInterface";
import moment from 'moment';
import AppContext from "../../Provider/AppContext";
import getValue from "../../../utils/getValue";

export default function ColumnDate({align, record, column, format, locale}: ColumnDateInterface) {
  const {locale: globalLocale} = useContext(AppContext);
  const [date, setDate] = useState<string>();
  const value = getValue(record, column);

  useMemo(() => {
    if (format === 'fromNow') {
      setDate(moment(value)
        .locale(locale || globalLocale)
        .fromNow());
      return;
    }

    setDate(moment(value)
      .locale(locale || globalLocale)
      .format(format || 'L HH:mm:ss'));
  }, [value, locale, format])

  return (
    <TableCell align={align}>{date}</TableCell>
  )
}
