import React, { useContext } from 'react';
import { useColdOrHot } from 'react-miniverse';

import AuthGuard from '../../components/Guards/AuthGuard';
import Layout from '../../components/Layout/Layout';
import AppContext from '../../components/Provider/AppContext';
import { ServicesModule } from '../../module/services.module';
import Link from '../../src/Link';

export default function index() {
  const { accountsService } = useContext<ServicesModule>(AppContext);
  const profile = useColdOrHot(accountsService.profile());

  return (
    <Layout>
      <AuthGuard>
        {(params: any) => (
          <div>
            Test
            {JSON.stringify(params)}
            <Link href="/" color="primary">Home</Link>

            {profile?.name}
          </div>
        )}
      </AuthGuard>
    </Layout>
  );
}
