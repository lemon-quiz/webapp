import {ArrowDropDown, ArrowDropUp} from "@material-ui/icons";
import {Box, IconButton} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import setQueryParam from "../../../utils/setQueryParam";
import getPrefixedValues from "../../../utils/getPrefixedValues";

export interface SortableInterface {
  column: string;
  prefix?: string;
}

export default function Sortable({column, prefix}: SortableInterface) {
  const router = useRouter();
  const [state, setState] = useState<string | null>(null);
  const {order_field, order_dir} = getPrefixedValues(router.query, prefix);

  useEffect(() => {
    if (order_field === column) {
      if (order_dir === 'desc') {
        setState('desc');
        return;
      }

      setState('asc');
      return;
    }

    setState(null);
  }, [order_field, order_dir]);

  const sort = (dir: string): void => {
    let params = {...router.query};

    if (state === dir) {
      params = setQueryParam(params, 'order_field', null, prefix);
      params = setQueryParam(params, 'order_dir', null, prefix);
      router.push({query: params});

      return;
    }

    params = setQueryParam(params, 'order_field', column, prefix);
    params = setQueryParam(params, 'order_dir', dir, prefix);
    router.push({query: params});
  }

  return (
    <Box p={1} alignSelf="flex-end">
      <div>
        <IconButton size="small" onClick={() => sort('asc')}>
          <ArrowDropUp color={state === 'asc' ? 'secondary' : 'inherit'}/>
        </IconButton>
        <IconButton size="small" onClick={() => sort('desc')}>
          <ArrowDropDown color={state === 'desc' ? 'secondary' : 'inherit'}/>
        </IconButton>
      </div>
    </Box>
  );
}
