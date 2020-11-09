import {
  Box,
  Button, Divider, InputAdornment, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AxiosError, AxiosResponse } from 'axios';
import arrayMutators from 'final-form-arrays';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useIntl } from 'react-intl';
import { useColdOrHot } from 'react-miniverse';

import { ServicesModule } from '../../../module/services.module';
import { FormResponse } from '../../../utils/FormResponse';
import Validators from '../../../utils/Validator';
import FieldRadio from '../../Fields/FieldRadio';
import TextField from '../../Fields/TextField';
import Pending from '../../Pending/Pending';
import AppContext from '../../Provider/AppContext';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px',
  },
}));

function QuizForm() {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const { push, query: { id } } = useRouter();
  const { quizzesService, snackbarService } = useContext<ServicesModule>(AppContext);
  const quiz = useColdOrHot(quizzesService.getQuiz(id as string), false, true);
  const { formatMessage } = useIntl();

  const validate = (values: any) => Validators.test(values, {
    name: [Validators.required],
    items: [{
      item_a: [Validators.required],
      item_b: [Validators.required],
    }],
  });

  const navigate = (res: AxiosResponse | AxiosError) => {
    setLoading(false);
    if ((res as AxiosError).isAxiosError) {
      return;
    }

    snackbarService.success('Successfully submitted the quiz.');
    push('/admin/quizzes');
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (id && id !== 'add') {
      await FormResponse.finalFormResponse(
        quizzesService.updateQuiz(id, data), navigate,
      );
      return;
    }

    await FormResponse.finalFormResponse(
      quizzesService.createQuiz(data), navigate,
    );
  };

  return (
    <Pending loading={loading}>
      <Paper elevation={3} className={styles.paper}>
        <Form
          initialValues={{ ...quiz }}
          onSubmit={onSubmit}
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
                <Field
                  name="lang_a"
                  component={TextField}
                  placeholder={formatMessage({ defaultMessage: 'Lang A' })}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Lang A' })}
                />
                <Field
                  name="lang_b"
                  component={TextField}
                  placeholder={formatMessage({ defaultMessage: 'Lang B' })}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Lang B' })}
                />

                <FieldArray name="items">
                  {({ fields }) => (
                    <div>
                      {fields.map((name, index) => (
                        <div key={name}>
                          <Box display="flex" flexDirection="row" alignContent="space-between">
                            <Box mr={1} display="flex" flexGrow={1}>
                              <Field
                                name={`${name}.item_a`}
                                component={TextField}
                                placeholder={formatMessage({ defaultMessage: 'Item language A' })}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                label={formatMessage({ defaultMessage: 'Item language A' })}
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
                                name={`${name}.item_b`}
                                component={TextField}
                                placeholder={formatMessage({ defaultMessage: 'Item language B' })}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                label={formatMessage({ defaultMessage: 'Item language B' })}
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
                          <Field
                            type="radio"
                            name={`${name}.group`}
                            value="1"
                            component={FieldRadio}
                          />
                          <Field
                            type="radio"
                            name={`${name}.group`}
                            value="2"
                            component={FieldRadio}
                          />
                          <Field
                            type="radio"
                            name={`${name}.group`}
                            value="3"
                            component={FieldRadio}
                          />
                          <Divider />
                        </div>
                      ))}
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => fields.push({ item_a: '', item_b: '', group: '1' })}
                      >
                        Add item
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
