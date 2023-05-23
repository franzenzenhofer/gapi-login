# GAPI-LOGIN

GAPI-LOGIN is a Node.js library designed to simplify the process of authenticating with the Google APIs using OAuth2.

## Installation

Since this package is not published on npm, you need to install it directly from GitHub:

```sh
npm install git+https://github.com/franzenzenhofer/gapi-login.git
```

Or add the following line to your package.json:

```json
"dependencies": {
    "gapi-login": "git+https://github.com/franzenzenhofer/gapi-login.git"
}
```

Then run `npm install`.

## Usage

Import the library and create a new instance of `GapiLogin`:

```javascript
import GapiLogin from 'gapi-login';

const scope = ['https://www.googleapis.com/auth/webmasters.readonly'];
const redirectUri = 'http://localhost:3000/callback';
const clientSecretPath = './client_secret.json';

const gsc = new GapiLogin(clientSecretPath, scope, redirectUri);
```

Authenticate with the Google API:

```javascript
await gsc.authenticate();
```

Once authenticated, you can use the `getAuth()` method to get the authenticated OAuth2 client:

```javascript
const authClient = gsc.getAuth();
```

## Examples

Here's an example of how to use the `GapiLogin` class with the Webmasters API:

```javascript
import GapiLogin from 'gapi-login';
import listSites from './tests/listSites.js';
import getTotalClicksLastMonth from './tests/totalClicksLastMonth.js';

(async () => {
    const scope = ['https://www.googleapis.com/auth/webmasters.readonly'];
    const redirectUri = 'http://localhost:3000/callback';
    const clientSecretPath = './client_secret.json';
    const gsc = new GapiLogin(clientSecretPath, scope, redirectUri);
    await gsc.authenticate();
    const sites = await listSites(gsc.getAuth());
    console.log('Sites:', sites);
    await getTotalClicksLastMonth(gsc.getAuth(), 'https://www.f19n.com/');
})();
```

## License

MIT