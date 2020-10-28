import {ArrowDropDown, ArrowDropUp} from "@material-ui/icons";
import {Box, IconButton} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

export interface SortableInterface {
  column: string;
}

export default function Sortable({column}: SortableInterface) {
  const router = useRouter();
  const [state, setState] = useState<string | null>(null);
  const {query: {order_field, order_dir}} = router;

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
    const params = {...router.query};
    params.order_field = column;
    params.order_dir = dir;

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
