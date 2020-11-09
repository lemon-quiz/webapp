import React, { ReactElement, useContext } from 'react';

import AppContext from '../components/Provider/AppContext';
import { ServicesModule } from '../module/services.module';
import {
  ExpectedRoleType,
} from '../services/accounts.service';

interface AccessInterface {
  children: ReactElement;
  expectedRole: ExpectedRoleType;

  [key: string]: any;
}

export default function Access({ children, expectedRole = [], ...rest }: AccessInterface) {
  const { accountsService } = useContext<ServicesModule>(AppContext);
  const access = accountsService.hasAccess(expectedRole);

  if (!access) {
    return <></>;
  }

  return React.cloneElement(children, rest);
}
