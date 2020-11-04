import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import React from 'react';

import Layout from '../components/Layout/Layout';

export default function Index() {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box my={4}>
          Some other page
        </Box>
      </Container>
    </Layout>
  );
}
