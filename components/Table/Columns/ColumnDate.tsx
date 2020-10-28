import {TableCell} from "@material-ui/core";
import React, {useContext, useMemo, useState} from "react";
import {ColumnDateInterface} from "../TableInterface";
import moment from 'moment';
import AppContext from "../../Provider/AppContext";


export default function ColumnDate({align, record, column, format, locale}: ColumnDateInterface) {
  const {locale: globalLocale} = useContext(AppContext);
  const [date, setDate] = useState<string>();

  useMemo(() => {
    if (format === 'fromNow') {
      setDate(moment(record[column])
        .locale(locale || globalLocale)
        .fromNow());
      return;
    }

    setDate(moment(record[column])
      .locale(locale || globalLocale)
      .format(format || 'L HH:mm:ss'));
  }, [record[column], locale, format])

  return (
    <TableCell align={align}>{date}</TableCell>
  )
}
