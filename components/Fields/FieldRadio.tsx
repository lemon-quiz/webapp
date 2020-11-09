import {
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import React from 'react';
import { FieldRenderProps } from 'react-final-form';

interface FieldRadioInterface<T, U extends HTMLElement = HTMLElement> extends FieldRenderProps<T, U> {
  label: string;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
}

const FieldRadio = ({
  input: {
    name, onChange, checked, value, ...inputProps
  },
  label,
  labelPlacement,
}: FieldRadioInterface<string, any>) => (
  <FormControlLabel
    name={name}
    value={value}
    checked={checked}
    onChange={onChange}
    control={<Radio inputProps={inputProps} />}
    label={label}
    labelPlacement={labelPlacement || 'start'}
  />
);

export default FieldRadio;
