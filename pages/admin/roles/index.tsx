import { Box, Button, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext } from 'react';
import { useColdOrLoad } from 'react-miniverse';

import AuthGuard from '../../../components/Guards/AuthGuard';
import Layout from '../../../components/Layout/Layout';
import Pending from '../../../components/Pending/Pending';
import AppContext from '../../../components/Provider/AppContext';
import AppTable from '../../../components/Table/AppTable';
import Column from '../../../components/Table/Columns/Column';
import ColumnActions from '../../../components/Table/Columns/ColumnActions';
import ColumnBoolean from '../../../components/Table/Columns/ColumnBoolean';
import ColumnDate from '../../../components/Table/Columns/ColumnDate';
import Access from '../../../core/Access';
import { RolesEntity } from '../../../module/accounts.module';
import { ServicesModule } from '../../../module/services.module';

function RolesIndex(): ReactElement {
  const { accountsService, snackbarService } = useContext<ServicesModule>(AppContext);
  const router = useRouter();
  const {
    query: {
      page, q, order_field, order_dir, name, grouped, email,
    }, push,
  } = router;

  const params = {
    page: page ?? 1,
    q,
    grouped,
    name,
    email,
    order_field: order_field || 'name',
    order_dir: order_dir || 'asc',
  };
  const roles = useColdOrLoad(accountsService.getRoles(params), params);

  const handleDelete = (record: RolesEntity) => {
    accountsService.deleteRole(record.id).subscribe(
      () => {
        snackbarService.info('Entity is deleted.');
        accountsService.getRoles(params).refresh();
      },
      () => snackbarService.error('There was a problem.'),
    );
  };

  return (
    <Layout>
      <Box display="flex">
        <Box flexGrow={1}>
          <Typography variant="h4" gutterBottom>
            Roles
          </Typography>
        </Box>
        <Box flexGrow={0} alignSelf="center" p={1}>
          <Access expectedRole={[{ 'accounts-role': 'write' }]}>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="primary"
              onClick={() => push('/admin/roles/add')}
            >
              Add
            </Button>
          </Access>
        </Box>
      </Box>

      <AuthGuard>
        {() => (
          <Pending loading={!roles}>
            <AppTable<RolesEntity> resource={roles}>
              <Column label="Name" column="name" searchable sortable />
              <Column label="Grouped" column="grouped" searchable sortable />
              <ColumnBoolean label="Private" column="private" sortable />
              <ColumnBoolean
                label="Init employee"
                column="init_employee"
                sortable
              />
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
              <ColumnActions column="id" handleDelete={handleDelete} requiredRole="accounts-role" />
            </AppTable>
          </Pending>
        )}
      </AuthGuard>
    </Layout>
  );
}

RolesIndex.isAuthorized = async ({ services }: { services: ServicesModule }) => services.storeService.has('AccountsService', 'profile');

export default RolesIndex;
