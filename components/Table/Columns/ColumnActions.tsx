import {Button, TableCell, Theme} from "@material-ui/core";
import React, {useState} from "react";
import {ColumnInterface} from "../TableInterface";
import {Delete, Edit} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {useRouter} from "next/router";
import {amber} from "@material-ui/core/colors";
import ConfirmDialog from "../../Dialog/ConfirmDialog";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      marginRight: theme.spacing(0.5),
    },
  },
  warning: {
    backgroundColor: amber.A400
  }
}));

interface ColumnActionsInterface<T = any> extends ColumnInterface {
  handleDelete?: (record: T) => void;
  path?: string;
}

export default function ColumnActions({align, record, column, path, handleDelete}: ColumnActionsInterface) {
  const styles = useStyles();
  const router = useRouter();
  const [open, toggleOpen] = useState(false);

  const handleClose = (submit: boolean) => {
    toggleOpen(false);

    if (!submit) {
      return;
    }

    if (handleDelete) {
      handleDelete(record);
    }
  }

  const navigate = () => {
    const pathname = path ?? router.pathname;

    router.push({
      pathname: `${pathname}/${record[column]}`
    });
  }

  return (
    <TableCell align={align}>
      <div className={styles.root}>
        <Button
          size={'small'}
          variant="outlined"
          color={'primary'}
          onClick={navigate}
          startIcon={<Edit/>}>
          Edit
        </Button>
        {handleDelete && <Button
          className={'warning'}
          size={'small'}
          variant="outlined"
          color={'secondary'}
          onClick={() => toggleOpen(true)}
        >
          <Delete/>
        </Button>}
      </div>
      <ConfirmDialog open={open}
                     handleClose={handleClose}
                     title={'Remove entity?'}
                     content={'Are you sure you want to remove this entity?'}/>
    </TableCell>
  )
}
