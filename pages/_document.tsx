import { ServerStyleSheets } from '@material-ui/styles';
import Document, { Head, Main, NextScript } from "next/document";
import { Fragment } from 'react'

class MyDocument extends Document<{
    pageContext
}> {

    render = () => <html lang="en" dir="ltr">
        <Head>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
            <link rel="shortcut icon" href="/static/favicon.ico" />
            <meta
                name="theme-color"
                content={
                    this.props.pageContext ? this.props.pageContext.theme.palette.primary.main : null
                } />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <link rel='stylesheet' type='text/css' href='/static/vendor/nesst.css' />
            <link rel='stylesheet' type='text/css' href='/static/vendor/nprogress.css' />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </html>
}

MyDocument.getInitialProps = async ctx => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            <Fragment key="styles">
                {initialProps.styles}
                {sheets.getStyleElement()}
            </Fragment>,
        ],
    };
};

export default MyDocument;
