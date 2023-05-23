// listSites.js
import { google } from 'googleapis';

async function listSites(auth) {
  const searchConsole = google.webmasters({ version: 'v3', auth });
  const response = await searchConsole.sites.list();
  return response.data.siteEntry;
}

export default listSites;
