import Column from "../../../Table/Columns/Column";
import AppTable from "../../../Table/AppTable";
import React, {useContext} from "react";
import AppContext, {AppContextInterface} from "../../../Provider/AppContext";
import {useColdOrLoad} from "react-miniverse";
import getPrefixedValues from "../../../../utils/getPrefixedValues";
import {useRouter} from "next/router";
import {
  ProfileInterface,
  RolesEntity
} from "../../../../module/accounts.module";
import ColumnPermission from "./ColumnPermission";

interface EventsInterface {
  account: ProfileInterface
}

export default function Roles({account}: EventsInterface) {
  const {accountsService} = useContext<AppContextInterface>(AppContext);
  const {query} = useRouter();
  const {page, order_field, order_dir, name, grouped} = getPrefixedValues(query);
  const params = {
    roles: account.id,
    name,
    grouped,
    page: page ?? 1,
    order_field: order_field || 'name',
    order_dir: order_dir || 'asc',
  }
  const roles = useColdOrLoad(accountsService.getRoles(params), params, true);

  if (!roles) {
    return <div>Loading...</div>;
  }

  return (
    <AppTable<RolesEntity>
      resource={roles}>
      <Column label={'Name'} column={'name'} searchable sortable/>
      <Column label={'Grouped'} column={'grouped'} searchable sortable/>
      <Column label={'Permissions'} column={'id'}>{(_value, record) => <ColumnPermission account={account} record={record}/>}</Column>
    </AppTable>
  );
}
