import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import React from 'react';

import Layout from '../components/Layout/Layout';

export default function Error403() {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box my={4}>
          <h1>403</h1>
          <p>Ahhh snap. You are not authorized over there.</p>
        </Box>
      </Container>
    </Layout>
  );
}
