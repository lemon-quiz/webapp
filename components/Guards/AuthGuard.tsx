import React, { useContext } from 'react';

import { ServicesModule } from '../../module/services.module';
import AppContext from '../Provider/AppContext';

export default function AuthGuard({ children }: { children: (params: any) => React.ReactElement }) {
  const { storeService } = useContext<ServicesModule>(AppContext);

  if (!storeService.has('AccountsService', 'profile')) {
    return (<div>unauthorized</div>);
  }

  return (
    <>
      {children({ x: 'y' })}
    </>
  );
}
