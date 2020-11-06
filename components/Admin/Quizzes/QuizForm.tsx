import {
  Box,
  Button, Divider, InputAdornment, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useIntl } from 'react-intl';

import Validators from '../../../utils/Validator';
import TextField from '../../Fields/TextField';
import Pending from '../../Pending/Pending';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px',
  },
}));

function QuizForm() {
  const styles = useStyles();
  const { formatMessage } = useIntl();

  const validate = (values: any) => Validators.test(values, {
    name: [Validators.required],
    email: [Validators.required, Validators.email],
  });

  return (
    <Pending loading={false}>
      <Paper elevation={3} className={styles.paper}>
        <Form
          initialValues={{}}
          onSubmit={() => {}}
          mutators={{
            ...arrayMutators,
          }}
          validate={validate}
          render={(all: any) => {
            const { handleSubmit, valid, submitFailed } = all;
            return (
              <form onSubmit={handleSubmit}>
                <Typography component="h1" variant="h5">
                  {formatMessage({ defaultMessage: 'New quiz' })}
                </Typography>
                <Field
                  name="name"
                  component={TextField}
                  placeholder="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Name' })}
                />

                <FieldArray name="question">
                  {({ fields }) => (
                    <div>
                      {fields.map((name, index) => (
                        <div key={name}>
                          <Box display="flex" flexDirection="row" alignContent="space-between">
                            <Box mr={1} display="flex" flexGrow={1}>
                              <Field
                                name={`${name}.lang_1`}
                                component={TextField}
                                placeholder="Language 1"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                label={formatMessage({ defaultMessage: 'String 1' })}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {index + 1}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Box>
                            <Box mr={1} display="flex" flexGrow={1}>
                              <Field
                                name={`${name}.lang_2`}
                                component={TextField}
                                placeholder="Language 2"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                label={formatMessage({ defaultMessage: 'String 2' })}
                              />
                            </Box>
                            <Box display="flex" flexShrink={1} alignSelf="center">
                              <div>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  type="button"
                                  onClick={() => fields.remove(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </Box>
                          </Box>
                          <Divider />
                        </div>
                      ))}
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => fields.push({ lang_1: '', lang_2: '' })}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={(!valid && !submitFailed)}
                >
                  {formatMessage({ defaultMessage: 'Save' })}
                </Button>
              </form>
            );
          }}
        />
      </Paper>
    </Pending>
  );
}

export default QuizForm;
