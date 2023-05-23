import fs from 'fs';
import express from 'express';
import { google } from 'googleapis';
import opn from 'opn';
import path from 'path';
import url from 'url';

const { OAuth2 } = google.auth;

class GapiLogin {
  constructor(clientSecretPath = null, scope, redirect_server_url = null) {
    console.log('clientSecretPath:', clientSecretPath);

    let absolutePath = null;
    if (clientSecretPath) {
      absolutePath = path.resolve(clientSecretPath);
      console.log('absolutePath:', absolutePath);
    }
    else
    {
      //lookin in the current directory for the client_secret.json file
      absolutePath = path.resolve('./client_secret.json');
    }
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const clientSecret = fs.readFileSync(absolutePath);
    const { client_id, client_secret, redirect_uris } = JSON.parse(clientSecret).installed;

    this.clientId = client_id;
    this.clientSecret = client_secret;
    this.redirectUri = redirect_uris[0];
    if(redirect_server_url)
    {
      this.redirectUri = redirect_server_url;
    }
    
    if(!this.redirectUri)
    {
      this.redirectUri = 'http://localhost:3000/callback';
    }

    this.oauth2Client = new OAuth2(client_id, client_secret, this.redirectUri);
    this.scope = scope;
  }
  async authenticate() {
    const tc = './token_cache/token.json';
    const tcDir = path.dirname(tc);
if (!fs.existsSync(tcDir)) {
  fs.mkdirSync(tcDir, { recursive: true });
}
    let token_is_valid = false;
    if (fs.existsSync(tc)) {
      const tokens = JSON.parse(fs.readFileSync(tc, 'utf-8'));
      this.oauth2Client.setCredentials(tokens);
      try {
        const res = await this.oauth2Client.request({
          url: this.scope[0],
          method: 'GET'
        });
        console.log('Token is still valid');
        token_is_valid = true;
      } catch (err) {
        console.log('Token is invalid, deleting token file');
        fs.unlinkSync(tc);
      }
    }
if (!token_is_valid) {
  const app = express();
  const port = url.parse(this.redirectUri).port || 80;
  const server = app.listen(port, () => console.log('Listening on port 3000'));
  // Wrap server listening in a Promise
  const waitForCallback = new Promise((resolve) => {
    const { pathname } = url.parse(this.redirectUri);
    console.log(`Listening for callback requests at ${pathname}`);
    app.get(pathname, async (req, res) => {
      try {
        const { code } = req.query;
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);

        fs.writeFileSync(tc, JSON.stringify(tokens));
        res.send('Authentication successful! You can close this window.');
        server.close();
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        server.close();
      } finally {
        console.log('Shutting down server');
        setTimeout(function () {
          server.close();
       }, 3000)
      }
    });
  });

  
      const authorizeUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.scope, // Use the scope from the credentials file
      });
  
      console.log(`Opening authentication URL in your default browser: ${authorizeUrl}`);
      opn(authorizeUrl); // Open the URL in the default browser
  
      await waitForCallback; // Wait for the Promise to resolve
    }
  }
  
  

  getAuth() {
    return this.oauth2Client;
  }
}

export default GapiLogin;
