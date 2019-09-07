import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import withRedux from 'next-redux-wrapper';
import App from "next/app";
import Head from "next/head";
import Router from 'next/router';
import Nprogress from 'nprogress';
import { ComponentType } from "react";
import JssProvider from "react-jss/lib/JssProvider";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import getPageContext from "../lib/getPageContext";
import { initSocketService } from "../lib/services";
import Store from "../lib/store";
import withAppHoc from "../lib/with-app-hoc";

class Application extends App<{
  store: any;
  showSnackBar;
  Component: ComponentType<{}>;
  metaRedirect?: boolean;
  destination?: string;
}> {
  pageContext;

  constructor(props) {
    super(props);
    this.pageContext = getPageContext(props.theme);

  }

  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    Router.events.on('routeChangeStart', (_) => Nprogress.start())
    Router.events.on('routeChangeComplete', (_) => Nprogress.stop())
    Router.events.on('routeChangeError', (_) => Nprogress.stop())
    initSocketService(this.props.store.dispatch);
  }

  render() {
    if (this.props.metaRedirect) {
      return (
        <Head>
          <meta
            httpEquiv="refresh"
            content={`0; url=${this.props.destination}`}
          />
        </Head>
      );
    }

    const { Component, pageProps, store, showSnackBar } = this.props;
    const { title } = pageProps;
    return (
      <Provider store={store}>
        <PersistGate persistor={store.__PERSISTOR} loading={null}>
          <Head>
            <title>{title ? `Nesst | ${title}` : "Nesst"}</title>
          </Head>
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
            sheetsManager={this.pageContext.sheetsManager}>
            <MuiThemeProvider theme={this.pageContext.theme}>
              <CssBaseline />
              {/* <Nprogress /> */}
              <Component
                pageContext={this.pageContext}
                showSnackBar={showSnackBar}
                {...pageProps} />
            </MuiThemeProvider>
          </JssProvider>
        </PersistGate>
      </Provider>
    )
  }
}

Application.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps)
    pageProps = await Component.getInitialProps(ctx);
  return { pageProps };
};

export default withRedux(Store)(withAppHoc(Application));
