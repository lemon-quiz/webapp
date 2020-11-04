const express = require('express');
const next = require('next');
const Cookies = require('cookies');
const IntlPolyfill = require('intl');
const { basename } = require('path');
const accepts = require('accepts');
const glob = require('glob');
const { readFileSync } = require('fs');
// global.DOMParser = new (require('jsdom').JSDOM)().window.DOMParser;

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const targetUrl = `${process.env.APIHOST}${process.env.APIPATH}`;
// const proxy = httpProxy.createProxyServer({
//   target: targetUrl,
//   secure: false
// });
console.log('CUSTOM SERVER');
// proxy.on('error', (e) => {
//   // console.log('Proxy error');
//   // console.error(e) // this is where the error is thrown
// });

// Get the supported languages by looking for translations in the `lang/` dir.
const supportedLanguages = glob
  .sync('./lang/*.json')
  .map((f) => basename(f, '.json'));

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map();
const getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(
      `@formatjs/intl-relativetimeformat/locale-data/${lang}`,
    );
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = (locale) => require(`./lang/${locale}.json`);

// proxy.on('error', (error, req, res) => {
//   if (error.code !== 'ECONNRESET') {
//     console.error('proxy error', error);
//   }
//   if (!res.headersSent) {
//     res.writeHead(500, {'content-type': 'application/json'});
//   }
//
//   const json = {error: 'proxy_error', reason: error.message};
//   res.end(JSON.stringify(json));
// });

app.prepare().then(() => {
  const server = express();
  server.use(Cookies.express());
  // server.use('/api', (req, res) => {
  //   if (req.cookies && req.cookies.get('token')) {
  //     req.headers.Authorization = `Bearer ${req.cookies.get('token')}`;
  //   }
  //   proxy.web(req, res);
  // });

  server.use(async (req, res) => {
    const accept = accepts(req);
    let locale = accept.language(supportedLanguages) || 'en';
    if (req.cookies && req.cookies.get('locale') && supportedLanguages.indexOf(req.cookies.get('locale')) > -1) {
      locale = req.cookies.get('locale');
    }

    req.supportedLanguages = supportedLanguages;
    req.locale = locale;
    req.localeDataScript = getLocaleDataScript(locale);
    req.messages = getMessages(locale);
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
