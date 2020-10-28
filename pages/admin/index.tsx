import React, {useContext} from "react";
import Layout from "../../components/Layout/Layout";
import Link from "../../src/Link";
import AppContext, {AppContextInterface} from "../../components/Provider/AppContext";
import {useColdOrHot} from "react-miniverse";
import AuthGuard from "../../components/Guards/AuthGuard";

export default function index() {
  const {accountsService} = useContext<AppContextInterface>(AppContext);
  const profile = useColdOrHot(accountsService.profile());

  return (
    <Layout>
      <AuthGuard>
        {(params: any) =>
          (<div>Test {JSON.stringify(params)}
            <Link href={'/'} color={'primary'}>Home</Link>

            {profile?.name}
          </div>)
        }
      </AuthGuard>
    </Layout>
  );
}
