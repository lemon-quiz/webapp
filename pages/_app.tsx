import React, {useEffect, useMemo, useState} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createIntl, createIntlCache, RawIntlProvider} from 'react-intl';
import Helmet from 'react-helmet';
import theme from '../theme/public';
import adminTheme from '../theme/admin';
import {
  AppProvider
} from '../components/Provider/AppContext';
import AccountsService from "../services/accounts.service";
import {ApiService, StoreService, CookiesService} from 'react-miniverse';
import {AxiosError, AxiosResponse} from "axios";
import {ProfileInterface} from "../module/accounts.module";
import SnackbarService from "../services/snackbar.service";
import Snackbar from "../components/Snackbar/Snackbar";

const cache = createIntlCache();

function initServices() {
  const storeService = new StoreService();
  const cookiesService = new CookiesService();
  const apiInstance = new ApiService(cookiesService);
  const accountsService = new AccountsService(apiInstance, storeService, cookiesService);
  const snackbarService = new SnackbarService();

  return {
    cookiesService,
    apiInstance,
    accountsService,
    storeService,
    snackbarService
  }
}

let globalServices = initServices();

function MyApp(props: any) {
  const {Component, pageProps, profile, _store, isAuthorized} = props;

  useEffect(() => {
    globalServices.apiInstance.setResponseMiddleWare((response: AxiosResponse | AxiosError) => {
      if ((response as AxiosError).isAxiosError) {

        const cast = (response as AxiosError);
        console.log({cast});
        globalServices.snackbarService.error(`${cast.response?.status} ${cast.response?.statusText} ${cast.response?.data?.message}`);


        return Promise.reject(response);
      }
      return response;
    })
  }, []);

  if (typeof window !== 'undefined') {
    globalServices.storeService.import(_store);
  }

  const [authTheme, setAuthTheme] = useState(globalServices.storeService.has('AccountsService', 'profile'));

  useEffect(() => {
    const sub = globalServices.accountsService.profile().hot().subscribe((profile: ProfileInterface) => {
      if (!profile) {
        setAuthTheme(false);
        return;
      }

      setAuthTheme(true);

      return () => {
        sub.unsubscribe();
      }
    });
  }, [])

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const {locale, messages} = props;
  const intl = useMemo(() => createIntl(
    {
      locale,
      messages,
      onError: () => {
      },
    },
    cache,
  ), [])


  let renderTheme = theme;
  if (authTheme) {
    renderTheme = adminTheme;
  }

  if (!isAuthorized) {
    return <>Nope</>;
  }

  return (
    <>
      <Helmet
        htmlAttributes={{lang: locale}}
        title="Hello next.js!"
        meta={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, width=device-width',
          },
          {property: 'og:title', content: 'Hello next.js!'},
        ]}
      />
      <ThemeProvider theme={renderTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline/>
        <AppProvider value={{profile, locale, ...globalServices}}>
          <RawIntlProvider value={intl}>
            <Component {...pageProps} />
            <Snackbar/>
          </RawIntlProvider>
        </AppProvider>
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async ({Component, ctx}: any) => {
  const {req} = ctx;
  let services;
  if (req) {
    services = initServices();
    services.cookiesService.withReq(req);
    globalServices = services;
  } else {
    services = globalServices;
  }

  const {cookiesService, accountsService, storeService} = services;

  if (cookiesService.get('token') && !storeService.has('AccountsService', 'profile')) {
    await accountsService.profile().toPromise().catch((error: AxiosError) => console.warn(error.message));
  }

  let isAuthorized = true;
  if (Component.isAuthorized) {
    isAuthorized = await Component.isAuthorized({services});
  }

  let pageProps = {};
  if (isAuthorized && Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, services);
  }

  let _store = {};
  await storeService.export().then((store: any) => _store = store);

  if (req) {
    storeService.completeAll();
  }

  // @ts-ignore
  const {locale, messages, supportedLanguages} = req || window.__NEXT_DATA__.props;

  return {
    pageProps, locale, messages, supportedLanguages, _store, isAuthorized
  };
};

export default MyApp;
