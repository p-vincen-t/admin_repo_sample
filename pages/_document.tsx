import { ServerStyleSheets } from "@material-ui/styles";
import Document, { Head, Main, NextScript } from "next/document";

let prefixer;
let cleanCSS;
if (process.env.NODE_ENV === "production") {
  /* eslint-disable global-require */
  const postcss = require("postcss");
  const autoprefixer = require("autoprefixer");
  const CleanCSS = require("clean-css");
  /* eslint-enable global-require */

  prefixer = postcss([autoprefixer]);
  cleanCSS = new CleanCSS();
}

class MyDocument extends Document<{
  pageContext;
  lang;
}> {
  render() {
    const { lang } = this.props;
    return (
      <html lang={lang} dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          {/* <link rel="manifest" href="/static/manifest.json" /> */}
          {/* <meta
            name="theme-color"
            content={
              this.props.pageContext ? this.props.pageContext.theme.palette.primary.main : null
            }
          /> */}
          <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" type="text/css" href="/static/vendor/nesst.css" />
          <link rel="stylesheet" type="text/css" href="/static/vendor/nprogress.css" />

          <style id="font-awesome-css" />
          <style id="app-search" />
          <style id="insertion-point-jss" />
        </Head>
        <body>
          <Main />
          {/* <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                window.ga('create','${GOOGLE_ID}','auto');
              `,
            }}
          /> */}
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });

  const initialProps = await Document.getInitialProps(ctx);

  let css = sheets.toString();
  // It might be undefined, e.g. after an error.
  if (css && process.env.NODE_ENV === "production") {
    const result1 = await prefixer.process(css, { from: undefined });
    css = result1.css;
    css = cleanCSS.minify(css).styles;
  }

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    lang: ctx.query.userLanguage || "en",
    styles: (
      <style
        id="jss-server-side"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: css }}
      />
    )
  };
};

export default MyDocument;
