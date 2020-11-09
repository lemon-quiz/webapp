import { Button, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useIntl } from 'react-intl';

import { RolesEntity } from '../../../module/accounts.module';
import { ServicesModule } from '../../../module/services.module';
import { FormResponse } from '../../../utils/FormResponse';
import Validators from '../../../utils/Validator';
import FieldCheckbox from '../../Fields/FieldCheckbox';
import TextField from '../../Fields/TextField';
import Pending from '../../Pending/Pending';
import AppContext from '../../Provider/AppContext';

interface RoleEditInterface {
  role: RolesEntity;
}

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px',
  },
}));

function RoleEdit({ role }: RoleEditInterface) {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { push, query: { id } } = useRouter();
  const { accountsService, snackbarService } = useContext<ServicesModule>(AppContext);

  const navigate = (res: AxiosResponse | AxiosError) => {
    setLoading(false);
    if ((res as AxiosError).isAxiosError) {
      return;
    }

    accountsService.getRoles().clear();
    snackbarService.success('Successfully submitted the role.');
    push('/admin/roles');
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (id && id !== 'add') {
      await FormResponse.finalFormResponse(
        accountsService.updateRole(id, data), navigate,
      );
      return;
    }

    await FormResponse.finalFormResponse(
      accountsService.createRole(data), navigate,
    );
  };

  const validate = (values: any) => Validators.test(values, {
    name: [Validators.required],
    private: [Validators.boolean],
    init_employee: [Validators.boolean],
  });

  return (
    <Pending loading={loading}>
      <Paper elevation={3} className={styles.paper}>
        <Form
          initialValues={role || { init_employee: false, private: false }}
          onSubmit={onSubmit}
          validate={validate}
          render={(all: any) => {
            const { handleSubmit, valid, submitFailed } = all;
            return (
              <form onSubmit={handleSubmit}>
                <Typography component="h1" variant="h5">
                  {formatMessage({ defaultMessage: 'Edit role' })}
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
                  name="grouped"
                  component={TextField}
                  placeholder="Grouped"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Grouped' })}
                />
                <Field
                  type="checkbox"
                  name="private"
                  component={FieldCheckbox}
                  placeholder="Private"
                  variant="outlined"
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Private' })}
                />
                <Field
                  type="checkbox"
                  name="init_employee"
                  component={FieldCheckbox}
                  placeholder="Init employee"
                  variant="outlined"
                  margin="normal"
                  label={formatMessage({ defaultMessage: 'Init employee' })}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={(!valid && !submitFailed) || !accountsService.hasAccess([{ 'accounts-role': 'update' }])}
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

export default RoleEdit;
