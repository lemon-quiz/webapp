import React, { useContext } from 'react';
import { useColdOrHot } from 'react-miniverse';

import AuthGuard from '../../components/Guards/AuthGuard';
import Layout from '../../components/Layout/Layout';
import AppContext, { AppContextInterface } from '../../components/Provider/AppContext';
import Link from '../../src/Link';

export default function index() {
  const { accountsService } = useContext<AppContextInterface>(AppContext);
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
