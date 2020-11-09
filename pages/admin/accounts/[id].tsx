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

import AccountForm from '../../../components/Admin/Accounts/AccountForm';
import Roles from '../../../components/Admin/Shared/Roles/Index';
import Events from '../../../components/Events/Events';
import AuthGuard from '../../../components/Guards/AuthGuard';
import Layout from '../../../components/Layout/Layout';
import AppContext from '../../../components/Provider/AppContext';
import TabPanel from '../../../components/TabPanel';
import { ServicesModule } from '../../../module/services.module';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px',
  },
}));

function Account() {
  const [tab, setTab] = useState(0);
  const { query: { id } } = useRouter();
  const { accountsService } = useContext<ServicesModule>(AppContext);
  const account = useColdOrHot(accountsService.getAccount(id as string), false, true);
  const styles = useStyles();

  const handleTab = (_event: ChangeEvent<any>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <AuthGuard>
      {() => (
        <Layout>
          <Typography variant="h4" gutterBottom>
            <span>Account </span>
            {' '}
            {account?.name}
          </Typography>
          <Tabs
            value={tab}
            onChange={handleTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Form" />
            {account && <Tab label="Roles" />}
            {account && <Tab label="Events" />}
          </Tabs>

          <TabPanel value={tab} index={0}>
            <Box display="flex" flexDirection="row">
              <Box width="50%" bgcolor="grey.300">
                <AccountForm account={account} />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            {account && <Roles account={account} />}
          </TabPanel>
          <TabPanel value={tab} index={2}>
            {account && (
              <Paper elevation={3} className={styles.paper}>
                <Events resource_id={account.id} model="User" />
              </Paper>
            )}
          </TabPanel>
        </Layout>
      )}
    </AuthGuard>
  );
}

Account.isAuthorized = ({ services: { accountsService } }: { services: ServicesModule }) => accountsService.hasAccess([{ 'accounts-user': 'read' }]);

Account.getInitialProps = async (ctx: any, { accountsService }: ServicesModule) => {
  if (ctx?.query?.id && ctx?.query?.id !== 'add') {
    await accountsService.getAccount(ctx.query.id, { include: 'roles' }).toPromise().catch((error: AxiosError) => console.warn(error.message));
  }

  return {};
};

export default Account;
