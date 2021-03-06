import {
  Box,
  Paper, Tab, Tabs,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useContext, useState } from 'react';
import { useColdOrHot } from 'react-miniverse';

import RoleEdit from '../../../components/Admin/Roles/EditForm';
import Accounts from '../../../components/Admin/Shared/Accounts';
import Events from '../../../components/Events/Events';
import Layout from '../../../components/Layout/Layout';
import AppContext from '../../../components/Provider/AppContext';
import TabPanel from '../../../components/TabPanel';
import { ServicesModule } from '../../../module/services.module';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px',
  },
}));

function Role() {
  const [tab, setTab] = useState(0);
  const { query: { id } } = useRouter();
  const { accountsService } = useContext<ServicesModule>(AppContext);
  const role = useColdOrHot(accountsService.getRole(id as string), false, true);
  const styles = useStyles();

  const handleTab = (_event: ChangeEvent<any>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        <span>Role</span>
        {' '}
        {role?.name}
      </Typography>
      <Tabs
        value={tab}
        onChange={handleTab}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Form" />
        {role && <Tab label="Accounts" />}
        {role && <Tab label="Events" />}
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Box display="flex" flexDirection="row">
          <Box width="50%" bgcolor="grey.300">
            <RoleEdit role={role} />
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {role && (
        <Paper elevation={3} className={styles.paper}>
          <Typography variant="h6" gutterBottom>
            Accounts with role:
            {role.name}
          </Typography>
          <Accounts resource_id={role.id} />
        </Paper>
        )}
      </TabPanel>
      <TabPanel value={tab} index={2}>
        {role && (
        <Paper elevation={3} className={styles.paper}>
          <Events resource_id={role.id} model="Role" />
        </Paper>
        )}
      </TabPanel>
    </Layout>
  );
}

Role.isAuthorized = ({ services: { accountsService } }: { services: ServicesModule }) => accountsService.hasAccess([{ 'accounts-role': 'update' }]);

Role.getInitialProps = async (ctx: any, { accountsService }: ServicesModule) => {
  if (ctx?.query?.id && ctx?.query?.id !== 'add') {
    await accountsService
      .getRole(ctx.query.id).toPromise()
      .catch((error: AxiosError) => console.warn(error.message));
  }

  return {};
};

export default Role;
