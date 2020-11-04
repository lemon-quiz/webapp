import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';

import Layout from '../components/Layout/Layout';
import AppContext from '../components/Provider/AppContext';
import Copyright from '../src/Copyright';
import Link from '../src/Link';
import ProTip from '../src/ProTip';

export default function Index() {
  const { formatMessage } = useIntl();
  const { storeService } = useContext(AppContext);

  useEffect(() => {
    // staticProfile = false;
    const sub = storeService.get('AccountsService', 'profile').subscribe(() => {
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box my={4}>

          <Typography variant="h4" component="h1" gutterBottom>
            {formatMessage({ defaultMessage: 'Blokje kaas bij?' })}
          </Typography>
          <Link href="/admin" color="secondary">
            {formatMessage({ defaultMessage: 'Go to the about page' })}
          </Link>
          <ProTip />
          <Copyright />

          <button
            type="button"
            onClick={() => {
              storeService.set('Misc', 'counter', undefined,
                storeService.getStatic('Misc', 'counter', undefined, 0) + 1);
            }}
          >
            +
          </button>
        </Box>
      </Container>
    </Layout>
  );
}
