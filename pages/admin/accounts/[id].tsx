import AppContext, {AppContextInterface} from "../../../components/Provider/AppContext";
import Layout from "../../../components/Layout/Layout";
import {
  Box,
  Paper, Tab, Tabs,
  Typography
} from "@material-ui/core";
import React, {ChangeEvent, useContext, useState} from "react";
import {useColdOrHot} from "react-miniverse";
import {useRouter} from "next/router";
import {AxiosError} from "axios";
import {makeStyles} from "@material-ui/styles";
import Events from "../../../components/Events/Events";
import TabPanel from "../../../components/TabPanel";
import AccountForm from "../../../components/Admin/Accounts/AccountForm";
import Roles from "../../../components/Admin/Shared/Roles/Index";

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px'
  }
}))

function Account() {
  const [tab, setTab] = useState(0);
  const {query: {id}} = useRouter();
  const {accountsService} = useContext<AppContextInterface>(AppContext);
  const account = useColdOrHot(accountsService.getAccount(id as string), false, true);
  const styles = useStyles();

  const handleTab = (_event: ChangeEvent<any>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        <span>Account </span> {account?.name}
      </Typography>
      <Tabs
        value={tab}
        onChange={handleTab}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Form"/>
        {account && <Tab label="Roles"/>}
        {account && <Tab label="Events"/>}
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Box display="flex" flexDirection="row">
          <Box width="50%" bgcolor={'grey.300'}>
            <AccountForm account={account}/>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {account && <Roles account={account}/>}
      </TabPanel>
      <TabPanel value={tab} index={2}>
        {account && <Paper elevation={3} className={styles.paper}>
          <Events resource_id={account.id} model={'User'}/>
        </Paper>}
      </TabPanel>
    </Layout>
  );
}

Account.isAuthorized = async ({services}: { services: AppContextInterface }) => {
  return services.storeService.has('AccountsService', 'profile');
}

Account.getInitialProps = async (ctx: any, {accountsService}: AppContextInterface) => {
  if (ctx?.query?.id && ctx?.query?.id !== 'add') {
    await accountsService.getAccount(ctx.query.id, {include: 'roles'}).toPromise().catch((error: AxiosError) => console.warn(error.message));
  }

  return {};
}

export default Account;
