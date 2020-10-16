import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import {useIntl} from "react-intl";

export default function Index() {
    const {formatMessage} = useIntl();

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {formatMessage({defaultMessage: "Blokje kaas bij?"})}
                </Typography>
                <Link href="/about" color="secondary">
                    {formatMessage({defaultMessage: "Go to the about page"})}
                </Link>
                <ProTip/>
                <Copyright/>
            </Box>
        </Container>
    );
}
