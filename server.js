const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());

// Create credentials object from environment variables
const credentials = {
  type: process.env.REACT_APP_GOOGLE_TYPE,
  project_id: process.env.REACT_APP_GOOGLE_PROJECT_ID,
  private_key_id: process.env.REACT_APP_GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  auth_uri: process.env.REACT_APP_GOOGLE_AUTH_URI,
  token_uri: process.env.REACT_APP_GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.REACT_APP_GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.REACT_APP_GOOGLE_CLIENT_X509_CERT_URL
};

// Create auth client
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

// Create sheets client
const sheets = google.sheets({ version: 'v4', auth });

app.get('/api/data', async (req, res) => {
  try {
    const spreadsheetId = process.env.REACT_APP_SPREADSHEET_ID;
    const range = 'Sheet1!A1:J100'; // Adjust range as needed
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    res.json(response.data.values);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 