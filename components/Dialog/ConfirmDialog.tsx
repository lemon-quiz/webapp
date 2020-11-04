import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface AlertDialogInterface {
  open: boolean;
  handleClose: (submit: boolean) => void;
  title: string;
  content: string;
  submitLabel?: string;
  cancelLabel?: string;
  cancelShow?: boolean;
}

export default function ConfirmDialog({open, title, content, submitLabel, cancelLabel, handleClose}: AlertDialogInterface) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"
                           dangerouslySetInnerHTML={{__html: content}}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          {cancelLabel ?? 'Cancel'}
        </Button>
        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
          {submitLabel ?? 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
