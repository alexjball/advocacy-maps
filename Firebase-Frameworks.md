# How Firebase Frameworks Support Works

Firebase has [experimental support](https://github.com/FirebaseExtended/firebase-framework-tools) for deploying sites using various frontend frameworks, including Next.js. Specifically with Next.js, it handles building the application, deploying static contente to Firebase Hosting, deploying SSR cloud functions using Cloud Functions v2, and setting up hosting redirects and rewrites to route traffic to the appropriate endpoint. In this way, firebase supports the "hybrid app" architecture of Next.js, where statically generated pages are served straight off the CDN and SSR pages are rendered by the cloud function.

1. The Firebase CLI runs `next build` to build the app
2. Statically generated pages are deployed as static files to Firebase Hosting
3. A cloud function is deployed using [Cloud Functions v2](https://firebase.google.com/docs/functions/beta) that runs the Next.js server for SSR
4. Hosting is configured with a catch-all rewrite to route traffic to the SSR function ([accessible via REST API](https://firebase.google.com/docs/reference/hosting/rest/v1beta1/sites.versions/list))

```json
{
  "rewrites": [
    {
      "glob": "**",
      "run": {
        // The name of the SSR cloud function
        "serviceId": "ssrmapleaball",
        "region": "us-central1"
      }
    }
  ],
  "cleanUrls": true
}
```

5. Firebase Hosting [prioritizes static content over rewrites](https://firebase.google.com/docs/hosting/full-config), so requests for static pages resolve to the static content on the CDN, and remaining requests are served by the SSR function.

## Cold Start Latency

By default, cloud function containers are stopped after 30 minutes. They take about 5 seconds to start up, so the first request to an SSR page can be slow. It is possible to [configure the function to idle at a lower cost](https://firebase.google.com/docs/functions/tips#min) to reduce this latency.

## Request Handling

To tell how a page was rendered, look at the response headers. Pages processed by the Next.js server have the `x-powered-by: Next.js` response header.

SSR pages are not cached by default, but pages can specify a cache lifetime to allow them to be served by the CDN. This is useful for reducing load on the function.

Static pages are served by the CDN. The first request is a cache miss and subsequent requests are served by the CDN.

## Internationalization (i18n)

Next.js generates static pages for all prefixed locales. It handles routing for non-prefixed pages.

TODO: Currently the root route doesn't work with i18n routing.
TODO: Verify that the native `next serve` also handles unprefixed pages with SSR.
