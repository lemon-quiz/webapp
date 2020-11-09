import {
  Avatar, Button, Grid, Theme, Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/styles';
import React, { useContext } from 'react';
import { Field, Form } from 'react-final-form';
import { useIntl } from 'react-intl';

import TextField from '../../components/Fields/TextField';
import CenteredBox from '../../components/Layout/CenteredBox';
import AppContext from '../../components/Provider/AppContext';
import { ServicesModule } from '../../module/services.module';
import Validators from '../../utils/Validator';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function Register() {
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const { apiInstance } = useContext<ServicesModule>(AppContext);

  const onSubmit = (data: any) => {
    apiInstance.get(`${process.env.API_ACCOUNTS}/register`, data);
  };

  const validate = (values: any) => Validators.test(values, {
    username: [Validators.required],
    password: [Validators.required, Validators.password],
    password_repeat: [Validators.required],
  });

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, valid }) => (
        <form onSubmit={handleSubmit}>
          <CenteredBox>
            <Grid item>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            </Grid>
            <Typography component="h1" variant="h5">
              {formatMessage({ defaultMessage: 'Register' })}
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
            <Field
              name="password_repeat"
              type="password_repeat"
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
              disabled={!valid}
            >
              {formatMessage({ defaultMessage: 'Register' })}
            </Button>

          </CenteredBox>
        </form>
      )}
    />
  );
}
