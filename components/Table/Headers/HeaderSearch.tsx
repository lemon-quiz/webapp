import {
  Box,
  FormControl, IconButton, Input,
  InputAdornment, InputLabel,
  TableCell,
} from "@material-ui/core";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  MouseEvent
} from "react";
import {useRouter} from "next/router";
import {from, Subject} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
import {Backspace} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import Sortable from "./Sortable";


interface HeaderSearchInterface {
  column: string;
  label: string;
  sortable?: boolean;
}
const useStyles = makeStyles(() => ({
  form_control: {
    width: '100%'
  }
}));

export default function HeaderSearch({column, label, sortable}: HeaderSearchInterface) {
  const router = useRouter();
  const classes = useStyles();
  const [value, setValue] = useState(router.query[column] || '');
  const subject: Subject<string> = useMemo(() => {
    return new Subject<string>();
  }, []);

  useEffect(() => {
    const subscription = subject
      .pipe(
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((value) => {
        const {query, pathname} = router;
        query[column] = value;
        query.page = '1';
        return from(router.push({
          pathname,
          query
        }))
      })
    return () => {
      subscription.unsubscribe();
      subject.complete();
    }
  }, []);

  const onChange = (event$: ChangeEvent<HTMLInputElement>) => {
    const value = event$.target.value;
    setValue(value);
    subject.next(value);
  }

  const handleClearInput = (event$: MouseEvent<HTMLButtonElement>) => {
    event$.preventDefault();
    setValue('');
    subject.next('');
  };

  return <TableCell>
    <Box display="flex">
      <Box p={1} flexGrow={1} alignSelf="flex-end">
        <FormControl className={classes.form_control}>
          <InputLabel htmlFor={`${column}-${label}`}>{label}</InputLabel>
          <Input
            id={`${column}-${label}`}
            value={value}
            onChange={onChange}
            endAdornment={
              (value && <InputAdornment position="end">
                  <IconButton
                    aria-label="remove input"
                    onClick={handleClearInput}
                  >
                    <Backspace/>
                  </IconButton>
                </InputAdornment>
              )}
          />
        </FormControl>
      </Box>
      {sortable && <Sortable column={column}/>}
    </Box>
  </TableCell>;
}
