import {
  Avatar,
  Button, Grid, Theme, Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Field, Form } from 'react-final-form';
import { useIntl } from 'react-intl';

import { ServicesModule } from '../../module/services.module';
import { FormResponse } from '../../utils/FormResponse';
import Validators from '../../utils/Validator';
import TextField from '../Fields/TextField';
import CenteredBox from '../Layout/CenteredBox';
import AppContext from '../Provider/AppContext';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function LoginForm() {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const classes = useStyles();
  const { accountsService } = useContext<ServicesModule>(AppContext);

  const navigate = (res: any) => {
    if (res.isAxiosError) {
      return;
    }

    router.push('/admin');
  };

  const onSubmit = async (data: any) => FormResponse.finalFormResponse(
    accountsService.login(data), navigate,
  );

  const validate = (values: any) => Validators.test(values, {
    username: [Validators.required],
    password: [Validators.required],
  });

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={(all: any) => {
        const { handleSubmit, valid, submitFailed } = all;
        return (
          <form onSubmit={handleSubmit}>
            <CenteredBox>
              <Grid item>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
              </Grid>
              <Typography component="h1" variant="h5">
                {formatMessage({ defaultMessage: 'Sign in' })}
              </Typography>
              <Field
                name="username"
                component={TextField}
                placeholder="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                label={formatMessage({ defaultMessage: 'Username' })}
              />
              <Field
                name="password"
                type="password"
                component={TextField}
                placeholder="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                label={formatMessage({ defaultMessage: 'Password' })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!valid && !submitFailed}
              >
                {formatMessage({ defaultMessage: 'Sign in' })}
              </Button>
            </CenteredBox>
          </form>
        );
      }}
    />
  );
}
