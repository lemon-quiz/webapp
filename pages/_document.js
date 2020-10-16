import React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';
import {ServerStyleSheets} from '@material-ui/core/styles';
import theme from '../src/theme';
import {Helmet} from "react-helmet";

export default class MyDocument extends Document {
    // static async getInitialProps(...args) {
    //     const documentProps = await super.getInitialProps(...args)
    //     // see https://github.com/nfl/react-helmet#server-usage for more information
    //     // 'head' was occupied by 'renderPage().head', we cannot use it
    //     return {...documentProps, helmet: Helmet.renderStatic()}
    // }

    // should render on <html>
    get helmetHtmlAttrComponents() {
        return this.props.helmet.htmlAttributes.toComponent()
    }

    // should render on <body>
    get helmetBodyAttrComponents() {
        return this.props.helmet.bodyAttributes.toComponent()
    }

    // should render on <head>
    get helmetHeadComponents() {
        return Object.keys(this.props.helmet)
            .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
            .map((el) => this.props.helmet[el].toComponent())
    }

    render() {
        return (
            <Html {...this.helmetHtmlAttrComponents}>
                <Head>
                    <meta name="theme-color" content={theme.palette.primary.main}/>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    {this.helmetHeadComponents}
                </Head>
                <body {...this.helmetBodyAttrComponents}>
                <Main/>
                <script
                    dangerouslySetInnerHTML={{
                        __html: this.props.localeDataScript
                    }}
                />
                <NextScript/>
                </body>
            </Html>

        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    // const documentProps = await super.getInitialProps(...args)
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it

    const {locale, localeDataScript, supportedLanguages} = ctx.req || window.__NEXT_DATA__.props.initialProps;

    return {
        ...initialProps,
        locale,
        localeDataScript,
        supportedLanguages,
        helmet: Helmet.renderStatic(),
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
