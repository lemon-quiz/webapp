import React from 'react'
import MatTextField from "@material-ui/core/TextField";
import {FieldRenderProps} from "react-final-form";

const TextField = ({
                     input: {name, onChange, value, ...restInput},
                     meta,
                     ...rest
                   }: FieldRenderProps<string, any>) => (
  <MatTextField
    {...rest}
    name={name}
    helperText={meta.touched ? (meta.error || meta.submitError) : undefined}
    error={(meta.error || meta.submitError) && meta.touched}
    inputProps={restInput}
    onChange={onChange}
    value={value}
  />
)

export default TextField;
