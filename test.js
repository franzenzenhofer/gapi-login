// test.js
import GapiLogin from './index.js';
import listSites from './tests/listSites.js';
import getTotalClicksLastMonth from './tests/totalClicksLastMonth.js';

(async () => {
  const scope = ['https://www.googleapis.com/auth/webmasters.readonly'];
  const redirectUri = 'http://localhost:3000/callback';
  const clientSecretPath = './client_secret.json';
  //const gsc = new GapiLogin(credentials);
  const gsc = new GapiLogin(clientSecretPath, scope, redirectUri);
  await gsc.authenticate();

 const sites = await listSites(gsc.getAuth());
 console.log('Sites:', sites);
 await getTotalClicksLastMonth(gsc.getAuth(), 'https://www.f19n.com/');
})();
