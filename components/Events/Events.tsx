import Column from "../Table/Columns/Column";
import ColumnDate from "../Table/Columns/ColumnDate";
import AppTable from "../Table/AppTable";
import React, {useContext} from "react";
import {EventsServiceInterface} from "../../module/events.module";
import AppContext, {AppContextInterface} from "../Provider/AppContext";
import {useColdOrLoad} from "react-miniverse";
import getPrefixedValues from "../../utils/getPrefixedValues";
import {useRouter} from "next/router";

const prefix = 'eve';

interface EventsInterface {
  resource_id: string | number;
  model?: string;
}

export default function Events({resource_id, model}: EventsInterface) {
  const {accountsService} = useContext<AppContextInterface>(AppContext);
  const {query} = useRouter();
  const {page, order_field, order_dir} = getPrefixedValues(query, prefix);

  const params = {
    resource_id,
    model,
    include: 'command',
    page: page ?? 1,
    order_field: order_field || 'updated_at',
    order_dir: order_dir || 'desc',
  }
  const events = useColdOrLoad(accountsService.getEvents(params), params, true);

  if (!events) {
    return <div>Loading...</div>;
  }

  return (
    <AppTable<EventsServiceInterface>
      prefix={prefix}
      resource={events}>
      <ColumnDate label={'Modified'}
                  column={'updated_at'}
                  format={'fromNow'}
                  sortable/>
      <Column label={'Class'} column={'class'} sortable/>
      <Column label={'Command'} column={'command.class'} sortable/>
      <Column label={'Rev. no'} column={'revision_number'} sortable/>
      <ColumnDate label={'Created'}
                  column={'created_at'}
                  sortable/>
      <Column label={'ID'} column={'id'}/>
    </AppTable>
  );
}
