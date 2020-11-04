import React, { ReactElement, useContext } from 'react';

import AppContext, { AppContextInterface } from '../components/Provider/AppContext';
import {
  ExpectedRoleType,
} from '../services/accounts.service';

interface AccessInterface {
  children: ReactElement;
  expectedRole: ExpectedRoleType;

  [key: string]: any;
}

export default function Access({ children, expectedRole = [], ...rest }: AccessInterface) {
  const { accountsService } = useContext<AppContextInterface>(AppContext);
  const access = accountsService.hasAccess(expectedRole);

  if (!access) {
    return <></>;
  }

  return React.cloneElement(children, rest);
}
