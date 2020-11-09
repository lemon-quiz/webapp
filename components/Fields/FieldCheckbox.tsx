import {
  Checkbox,
  FormControl,
  FormControlLabel, FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { FieldRenderProps } from 'react-final-form';

const useStyles = makeStyles(() => ({
  formControl: {
    display: 'block',
  },
}));

const FieldCheckbox = ({
  input: {
    name, onChange, checked, ...restInput
  },
  meta,
  ...rest
}: FieldRenderProps<string, any>) => {
  const classes = useStyles();

  return (
    <FormControl
      required
      error={meta.error}
      component="fieldset"
      className={classes.formControl}
    >
      <FormControlLabel
        control={(
          <Checkbox
            color="primary"
            name={name}
            inputProps={restInput}
            onChange={onChange}
            checked={checked}
          />
        )}
        label="..."
        {...rest}
      />
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default FieldCheckbox;
