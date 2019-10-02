// Use the same helper as Babel to avoid bundle bloat.

// import "core-js/modules/es6.array.find-index";
// import "core-js/modules/es6.set";

import { jssPreset, StylesProvider } from "@material-ui/styles";
import acceptLanguage from "accept-language";
import { ThemeProvider } from "contexts/ThemeContext";

import { create } from "jss";
import rtl from "jss-rtl";
import { initSocketService } from "lib/services";
// import serviceWorker from "lib/serviceWorker";
import Store from "lib/store";
import withAppHoc from "lib/with-app-hoc";
import withRedux from "next-redux-wrapper";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import Nprogress from "nprogress";
import { ComponentType, Fragment, StrictMode, useEffect } from "react";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/lib/integration/react";
import loadScript from "utils/loadScript";


// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: process.browser ? document.querySelector("#insertion-point-jss") : null
});

acceptLanguage.languages(["en"]);

// // Inspired by
// // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
// function forcePageReload(registration) {
//   // console.log('already controlled?', Boolean(navigator.serviceWorker.controller));

//   if (!navigator.serviceWorker.controller) {
//     // The window client isn't currently controlled so it's a new service
//     // worker that will activate immediately.
//     return;
//   }

//   // console.log('registration waiting?', Boolean(registration.waiting));
//   if (registration.waiting) {
//     // SW is waiting to activate. Can occur if multiple clients open and
//     // one of the clients is refreshed.
//     registration.waiting.postMessage("skipWaiting");
//     return;
//   }

//   function listenInstalledStateChange() {
//     registration.installing.addEventListener("statechange", event => {
//       // console.log('statechange', event.target.state);
//       if (event.target.state === "installed" && registration.waiting) {
//         // A new service worker is available, inform the user
//         registration.waiting.postMessage("skipWaiting");
//       } else if (event.target.state === "activated") {
//         // Force the control of the page by the activated service worker.
//         window.location.reload();
//       }
//     });
//   }

//   if (registration.installing) {
//     listenInstalledStateChange();
//     return;
//   }

//   // We are currently controlled so a new SW may be found...
//   // Add a listener in case a new SW is found,
//   registration.addEventListener("updatefound", listenInstalledStateChange);
// }

// async function registerServiceWorker(hostname = "localhost") {
//   if (
//     "serviceWorker" in navigator &&
//     process.env.NODE_ENV === "production" &&
//     window.location.host.indexOf(hostname) <= 0
//   ) {
//     // register() automatically attempts to refresh the sw.js.
//     const registration = await serviceWorker();
//     // Force the page reload for users.
//     forcePageReload(registration);
//   }
// }

const USE_STRICT_MODE = false;
const ReactMode = USE_STRICT_MODE ? StrictMode : Fragment;

let dependenciesLoaded = false;

function loadDependencies() {
  if (dependenciesLoaded) {
    return;
  }

  dependenciesLoaded = true;

  loadScript("https://www.google-analytics.com/analytics.js", document.querySelector("head"));
}

const Wrapper = props => {
  const { children, store, title } = props;

  useEffect(() => {
    loadDependencies();
    // registerServiceWorker();

    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    Router.events.on("routeChangeStart", _ => Nprogress.start());
    Router.events.on("routeChangeComplete", _ => Nprogress.stop());
    Router.events.on("routeChangeError", _ => Nprogress.stop());
    initSocketService(store.dispatch);
  }, []);

  return (
    <ReactMode>
      <Head>
        <title>{title ? `Nesst | ${title}` : "Nesst"}</title>
      </Head>
      <Provider store={store}>
      <StylesProvider jss={jss}>
            <ThemeProvider>
            {children}
            </ThemeProvider>            
          </StylesProvider>
        {/* <PersistGate persistor={store.__PERSISTOR} loading={null}>
          <StylesProvider jss={jss}>
            <ThemeProvider>
            {children}
            </ThemeProvider>            
          </StylesProvider>

          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
            sheetsManager={this.pageContext.sheetsManager}>
            <MuiThemeProvider theme={this.pageContext.theme}>
              <CssBaseline />
              <Nprogress />
              <Component
                pageContext={this.pageContext}
                showSnackBar={showSnackBar}
                {...pageProps} />
            </MuiThemeProvider>
          </JssProvider> 
        </PersistGate> */}
      </Provider>
    </ReactMode>
  );
};

class Application extends App<{
  store: any;
  showSnackBar;
  Component: ComponentType<{}>;
  metaRedirect?: boolean;
  destination?: string;
}> {

  render() {
    const { Component, pageProps, showSnackBar, store } = this.props;
    const { title } = pageProps;
    return (
      <Wrapper store={store} title={title} >
        <Component  showSnackBar={showSnackBar} {...pageProps} />
      </Wrapper>
    );
  }
}

Application.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);
  return { pageProps };
};

export default withRedux(Store)(withAppHoc(Application));
