import React, {useContext, useEffect, useState} from 'react';
import MatSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AppContext, {AppContextInterface} from "../Provider/AppContext";

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Snackbar() {
  const [snack, setSnack] = useState<any>({
    open: false,
    type: 'info',
    message: null
  });
  const {snackbarService} = useContext<AppContextInterface>(AppContext);

  useEffect(() => {
    const sub = snackbarService.subject.subscribe((next) => {
      if (!next) {
        return;
      }
      setSnack({open: true, ...next});
    });

    return () => {
      sub.unsubscribe();
    }
  }, []);

  const handleClose = (_event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack({open: false, type: 'info', message: null});
  };

  return (
    <MatSnackbar open={snack.open}
                 autoHideDuration={6000}
                 onClose={handleClose}>
      <Alert onClose={handleClose} severity={snack.type}>
        {snack.message}
      </Alert>
    </MatSnackbar>
  );
}
