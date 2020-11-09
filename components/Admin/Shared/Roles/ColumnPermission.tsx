import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';

import {
  ProfileInterface,
  RolesEntity,
} from '../../../../module/accounts.module';
import { ServicesModule } from '../../../../module/services.module';
import AppContext from '../../../Provider/AppContext';

interface ColumnPermissionInterface {
  account: ProfileInterface;
  record: RolesEntity;
}

interface StateInterface {
  read: boolean;
  write: boolean;
  update: boolean;
  delete: boolean;
}

interface UpdateRoleInterface extends StateInterface {
  role_id: string | number;
}

export default function ColumnPermission({ account, record }: ColumnPermissionInterface) {
  const { accountsService, snackbarService } = useContext<ServicesModule>(AppContext);
  const [state, setState] = useState<StateInterface>({
    read: false,
    write: false,
    update: false,
    delete: false,
  });

  const permission = useMemo(() => {
    const accountRole = account.roles?.find((role) => role.id === record.id);
    if (accountRole) {
      return {
        read: accountRole.pivot.req_get,
        write: accountRole.pivot.req_post,
        update: accountRole.pivot.req_put,
        delete: accountRole.pivot.req_delete,
      };
    }

    return {
      read: false,
      write: false,
      update: false,
      delete: false,
    };
  }, [account.id]);

  useEffect(() => {
    setState(permission);
  }, [permission]);

  const submitRole = (data: UpdateRoleInterface) => {
    accountsService.updateAccountRole(account.id, data).subscribe(() => {
      snackbarService.success('Role has been saved.');
    });
  };

  //  MouseEvent<HTMLInputElement> kept giving errors
  const handleChange = (event: any) => {
    if (typeof event?.target?.name === 'undefined' || typeof event?.target?.checked === 'undefined') {
      return;
    }

    const data = {
      role_id: record.id,
      ...state,
      [event.target.name]: event.target.checked,
    };
    submitRole(data);

    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleFull = (event: any) => {
    setState((prevState: any) => {
      const newState: StateInterface = { ...prevState };
      Object.keys(prevState).forEach((type: string) => (newState as any)[type] = event.target.checked);

      const data = { role_id: record.id, ...newState };
      submitRole(data);

      return newState;
    });
  };

  const isIndeterminate = () => {
    const filtered = Object.keys((state as any))
      .map((key: any): any => (state as any)[key])
      .filter((checked: boolean) => checked);

    return filtered.length > 0 && filtered.length < Object.keys(state).length;
  };

  const isChecked = () => {
    const filtered = Object.keys((state as any))
      .map((key: any): any => (state as any)[key])
      .filter((checked: boolean) => checked);

    return filtered.length === Object.keys(state).length;
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={(
          <Checkbox
            name="full"
            onChange={handleFull}
            checked={isChecked()}
            indeterminate={isIndeterminate()}
            color="primary"
          />
)}
        label="Full"
      />
      <FormControlLabel
        control={(
          <Checkbox
            name="read"
            checked={state.read}
            onChange={handleChange}
          />
)}
        label="Read"
      />
      <FormControlLabel
        control={(
          <Checkbox
            name="write"
            checked={state.write}
            onChange={handleChange}
          />
)}
        label="Write"
      />
      <FormControlLabel
        control={(
          <Checkbox
            name="update"
            checked={state.update}
            onChange={handleChange}
          />
)}
        label="Update"
      />
      <FormControlLabel
        control={(
          <Checkbox
            name="delete"
            checked={state.delete}
            onChange={handleChange}
          />
)}
        label="Delete"
      />
    </FormGroup>
  );
}
