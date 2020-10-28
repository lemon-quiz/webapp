import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Layout from "../components/Layout/Layout";

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
