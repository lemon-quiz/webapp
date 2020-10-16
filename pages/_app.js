import React from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import {createIntl, createIntlCache, RawIntlProvider} from 'react-intl'
import Helmet from "react-helmet";

const cache = createIntlCache();
export default function MyApp(props) {
    const {Component, pageProps} = props;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }


    }, []);

    const {locale, messages} = props;
    const intl = createIntl(
        {
            locale,
            messages,
            onError: (err) => {
            }
        },
        cache
    );


    return (
        <React.Fragment>
            <Helmet
                htmlAttributes={{lang: 'en'}}
                title="Hello next.js!"
                meta={[
                    {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1, width=device-width',
                    },
                    {property: 'og:title', content: 'Hello next.js!'},
                ]}
            />
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <RawIntlProvider value={intl}>
                    <Component {...pageProps} />
                </RawIntlProvider>
            </ThemeProvider>
        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

MyApp.getInitialProps = async ({Component, ctx, ...rest}) => {
    const {req} = ctx;
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
    }
    const {locale, messages, supportedLanguages} = req || window.__NEXT_DATA__.props.initialProps;
    return {pageProps, locale, messages, supportedLanguages}
}
