import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useColdOrLoad } from 'react-miniverse';

import { ProfileInterface } from '../../../../module/accounts.module';
import { ServicesModule } from '../../../../module/services.module';
import getPrefixedValues from '../../../../utils/getPrefixedValues';
import AppContext from '../../../Provider/AppContext';
import AppTable from '../../../Table/AppTable';
import Column from '../../../Table/Columns/Column';
import ColumnActions from '../../../Table/Columns/ColumnActions';
import ColumnDate from '../../../Table/Columns/ColumnDate';

const prefix = 'acc';

interface EventsInterface {
  resource_id: string | number;
}

export default function Accounts({ resource_id }: EventsInterface) {
  const { accountsService } = useContext<ServicesModule>(AppContext);
  const { query } = useRouter();
  const { page, order_field, order_dir } = getPrefixedValues(query, prefix);

  const params = {
    roles: resource_id,
    include: 'roles',
    page: page ?? 1,
    order_field: order_field || 'updated_at',
    order_dir: order_dir || 'desc',
  };
  const events = useColdOrLoad(accountsService.getAccounts(params), params, true);

  if (!events) {
    return <div>Loading...</div>;
  }

  return (
    <AppTable<ProfileInterface>
      prefix={prefix}
      resource={events}
    >
      <ColumnDate
        label="Modified"
        column="updated_at"
        format="fromNow"
        sortable
      />
      <Column label="Name" column="name" sortable />
      <Column label="Email" column="email" sortable />
      <Column label="ID" column="id" />
      <ColumnActions column="id" path="/admin/accounts" />
    </AppTable>
  );
}
