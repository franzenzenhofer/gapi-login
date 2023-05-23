import { google } from 'googleapis';

async function getTotalClicksLastMonth(auth, webwebp) {
  const searchConsole = google.webmasters({ version: 'v3', auth });
  const webPropertyUrl = webwebp;
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  const response = await searchConsole.searchanalytics.query({
    siteUrl: webPropertyUrl,
    startDate,
    endDate,
    dimensions: ['date'],
    fields: 'rows(clicks)',
  });

  const totalClicks = response.data.rows.reduce((total, row) => total + row.clicks, 0);
  console.log(`Total clicks for ${webPropertyUrl} in the last 30 days: ${totalClicks}`);
}

export default getTotalClicksLastMonth;