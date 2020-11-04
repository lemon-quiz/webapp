import { Box, Button, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext } from 'react';
import { useColdOrLoad } from 'react-miniverse';

import AuthGuard from '../../../components/Guards/AuthGuard';
import Layout from '../../../components/Layout/Layout';
import Pending from '../../../components/Pending/Pending';
import AppContext, { AppContextInterface } from '../../../components/Provider/AppContext';
import AppTable from '../../../components/Table/AppTable';
import Column from '../../../components/Table/Columns/Column';
import ColumnActions from '../../../components/Table/Columns/ColumnActions';
import ColumnDate from '../../../components/Table/Columns/ColumnDate';
import { ProfileInterface } from '../../../module/accounts.module';
import getPrefixedValues from '../../../utils/getPrefixedValues';

const prefix = 'acc';

function AccountsIndex(): ReactElement {
  const { accountsService } = useContext<AppContextInterface>(AppContext);
  const { push, query } = useRouter();
  const {
    page, q, order_field, order_dir, name, email,
  } = getPrefixedValues(query, prefix);

  const params = {
    page: page ?? 1,
    q,
    name,
    email,
    order_field,
    order_dir,
  };
  const accounts = useColdOrLoad(accountsService.getAccounts(params), params, true);

  return (
    <Layout>
      <Box display="flex">
        <Box flexGrow={1}>
          <Typography variant="h4" gutterBottom>
            Roles
          </Typography>
        </Box>
        <Box flexGrow={0} alignSelf="center" p={1}>
          <Button
            startIcon={<Add />}
            variant="contained"
            color="primary"
            onClick={() => push('/admin/accounts/add')}
          >
            Add
          </Button>
        </Box>
      </Box>

      <AuthGuard>
        {() => (
          <Pending loading={!accounts}>
            <AppTable<ProfileInterface>
              prefix={prefix}
              resource={accounts}
            >
              <Column label="Name" column="name" searchable sortable />
              <Column label="E-mail" column="email" searchable sortable />
              <ColumnDate
                label="Created"
                column="created_at"
                sortable
              />
              <ColumnDate
                label="Modified"
                column="updated_at"
                format="fromNow"
                sortable
              />
              <ColumnActions column="id" />
            </AppTable>
          </Pending>
        )}
      </AuthGuard>
    </Layout>
  );
}

AccountsIndex.isAuthorized = async ({ services }: { services: AppContextInterface }) => services.storeService.has('AccountsService', 'profile');

export default AccountsIndex;
