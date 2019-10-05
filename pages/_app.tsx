import acceptLanguage from "accept-language";
import { NotificationProvider } from "contexts/NotificationContext";
import { SocketProvider } from "contexts/SocketContext";
import { ThemeProvider } from "contexts/ThemeContext";
import serviceWorker from "lib/serviceWorker";
import Store from "lib/store";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import Nprogress from "nprogress";
import { Fragment, StrictMode } from "react";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import loadScript from "utils/loadScript";


acceptLanguage.languages(["en"]);

// Inspired by
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
function forcePageReload(registration) {
  // console.log('already controlled?', Boolean(navigator.serviceWorker.controller));

  if (!navigator.serviceWorker.controller) {
    // The window client isn't currently controlled so it's a new service
    // worker that will activate immediately.
    return;
  }

  // console.log('registration waiting?', Boolean(registration.waiting));
  if (registration.waiting) {
    // SW is waiting to activate. Can occur if multiple clients open and
    // one of the clients is refreshed.
    registration.waiting.postMessage("skipWaiting");
    return;
  }

  function listenInstalledStateChange() {
    registration.installing.addEventListener("statechange", event => {
      // console.log('statechange', event.target.state);
      if (event.target.state === "installed" && registration.waiting) {
        // A new service worker is available, inform the user
        registration.waiting.postMessage("skipWaiting");
      } else if (event.target.state === "activated") {
        // Force the control of the page by the activated service worker.
        window.location.reload();
      }
    });
  }

  if (registration.installing) {
    listenInstalledStateChange();
    return;
  }

  // We are currently controlled so a new SW may be found...
  // Add a listener in case a new SW is found,
  registration.addEventListener("updatefound", listenInstalledStateChange);
}

async function registerServiceWorker(hostname = "localhost") {
  if (
    "serviceWorker" in navigator &&
    process.env.NODE_ENV === "production" &&
    window.location.host.indexOf(hostname) <= 0
  ) {
    // register() automatically attempts to refresh the sw.js.
    const registration = await serviceWorker();
    // Force the page reload for users.
    forcePageReload(registration);
  }
}

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

class Application extends App {
  store;
  constructor(props) {
    super(props);

    this.store = Store(props.initialReduxState);
  }

  componentDidMount() {
    loadDependencies();
    registerServiceWorker();
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    Router.events.on("routeChangeStart", _ => Nprogress.start());
    Router.events.on("routeChangeComplete", _ => Nprogress.stop());
    Router.events.on("routeChangeError", _ => Nprogress.stop());
  }

  render() {
    const { Component, pageProps } = this.props;
    const { title } = pageProps;
    return (
      <ReactMode>
        <Head>
          <title>{title ? `Nesst | ${title}` : "Nesst"}</title>
        </Head>
        <Provider store={this.store}>
          <ThemeProvider>
            <SocketProvider store={this.store}>
              <NotificationProvider>
                <Component {...pageProps} />
              </NotificationProvider>
            </SocketProvider>
          </ThemeProvider>
          {/* <PersistGate persistor={this.store.__PERSISTOR} loading={<div/>}>
            <ThemeProvider>
              <SocketProvider store={this.store}>
                <NotificationProvider >
                  <Component {...pageProps} />
                </NotificationProvider>
              </SocketProvider>
            </ThemeProvider>
          </PersistGate> */}
        </Provider>
      </ReactMode>
    );
  }
}

Application.getInitialProps = async ({ Component, ctx }) => {
  // Always make a new store if server, otherwise state is shared between requests
  // Get or Create the store with `undefined` as initialState
  // This allows you to set a custom default initialState
  const reduxStore = Store();

  let pageProps = {};
  if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);
  return { pageProps, initialReduxState: reduxStore.getState() };
};

export default Application;
