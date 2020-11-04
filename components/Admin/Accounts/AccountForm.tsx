import { Button, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useIntl } from 'react-intl';

import { ProfileInterface } from '../../../module/accounts.module';
import { FormResponse } from '../../../utils/FormResponse';
import Validators from '../../../utils/Validator';
import TextField from '../../Fields/TextField';
import Pending from '../../Pending/Pending';
import AppContext, { AppContextInterface } from '../../Provider/AppContext';

interface AccountFormInterface {
  account: ProfileInterface;
}

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px',
  },
}));

function AccountForm({ account }: AccountFormInterface) {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { push, query: { id } } = useRouter();
  const { accountsService, snackbarService } = useContext<AppContextInterface>(AppContext);

  const navigate = (res: AxiosResponse | AxiosError) => {
    setLoading(false);
    if ((res as AxiosError).isAxiosError) {
      return;
    }

    accountsService.getRoles().clear();
    snackbarService.success('Successfully submitted the account.');
    push('/admin/accounts');
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (id && id !== 'add') {
      await FormResponse.finalFormResponse(
        accountsService.updateAccount(id, data), navigate,
      );
      return;
    }

    await FormResponse.finalFormResponse(
      accountsService.createAccount(data), navigate,
    );
  };

  const validate = (values: any) => Validators.test(values, {
    name: [Validators.required],
    email: [Validators.required, Validators.email],
  });

  return (
    <Pending loading={loading}>
      <Paper elevation={3} className={styles.paper}>
        <Form
          initialValues={account}
          onSubmit={onSubmit}
          validate={validate}
          render={(all: any) => {
            const { handleSubmit, valid, submitFailed } = all;
            return (
              <form onSubmit={handleSubmit}>
                <Typography component="h1" variant="h5">
                  {formatMessage({ defaultMessage: 'Edit account' })}
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
                  name="email"
                  component={TextField}
                  placeholder="E-mail"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Email' })}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={(!valid && !submitFailed) || !accountsService.access('accounts-user', 'update')}
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

export default AccountForm;
