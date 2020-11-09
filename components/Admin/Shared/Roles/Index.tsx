import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useColdOrLoad } from 'react-miniverse';

import {
  ProfileInterface,
  RolesEntity,
} from '../../../../module/accounts.module';
import { ServicesModule } from '../../../../module/services.module';
import getPrefixedValues from '../../../../utils/getPrefixedValues';
import AppContext from '../../../Provider/AppContext';
import AppTable from '../../../Table/AppTable';
import Column from '../../../Table/Columns/Column';
import ColumnPermission from './ColumnPermission';

interface EventsInterface {
  account: ProfileInterface
}

export default function Roles({ account }: EventsInterface) {
  const { accountsService } = useContext<ServicesModule>(AppContext);
  const { query } = useRouter();
  const {
    page, order_field, order_dir, name, grouped,
  } = getPrefixedValues(query);
  const params = {
    roles: account.id,
    name,
    grouped,
    page: page ?? 1,
    order_field: order_field || 'name',
    order_dir: order_dir || 'asc',
  };
  const roles = useColdOrLoad(accountsService.getRoles(params), params, true);

  if (!roles) {
    return <div>Loading...</div>;
  }

  return (
    <AppTable<RolesEntity> resource={roles}>
      <Column label="Name" column="name" searchable sortable />
      <Column label="Grouped" column="grouped" searchable sortable />
      <Column label="Permissions" column="id">{(_value, record) => <ColumnPermission account={account} record={record} />}</Column>
    </AppTable>
  );
}
