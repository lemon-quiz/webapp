import Layout from "../../../components/Layout/Layout";
import React, {ReactElement, useContext} from "react";
import AuthGuard from "../../../components/Guards/AuthGuard";
import {useColdOrLoad} from "react-miniverse";
import AppContext, {AppContextInterface} from "../../../components/Provider/AppContext";
import Pending from "../../../components/Pending/Pending";
import {useRouter} from "next/router";
import AppTable from "../../../components/Table/AppTable";
import Column from "../../../components/Table/Columns/Column";
import ColumnDate from "../../../components/Table/Columns/ColumnDate";
import {ProfileInterface} from "../../../module/accounts.module";

export default function AccountsIndex(): ReactElement {
  const {accountsService} = useContext<AppContextInterface>(AppContext);
  const router = useRouter();
  const {query: {page, q, order_field, order_dir, name, email}} = router;

  const params = {
    page: page ?? 1,
    q,
    name,
    email,
    order_field: order_field,
    order_dir: order_dir,
  }
  const accounts = useColdOrLoad(accountsService.getAccounts(params), params);

  return (
    <Layout>
      <AuthGuard>
        {() =>
          <Pending loading={!accounts}>
            <AppTable<ProfileInterface>
              resource={accounts}>
              <Column label={'Name'} column={'name'} searchable sortable/>
              <Column label={'E-mail'} column={'email'} searchable sortable/>
              <ColumnDate label={'Created'}
                          column={'created_at'}
                          sortable/>
              <ColumnDate label={'Modified'}
                          column={'updated_at'}
                          format={'fromNow'}
                          sortable/>
            </AppTable>
          </Pending>
        }
      </AuthGuard>
    </Layout>
  );
}
