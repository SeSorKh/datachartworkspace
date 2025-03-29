const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SHEET_ID = '1WQQaPcC8LjWk7_JjFoPhcTo1sz6Do__Xq5sMoNYrj8Q';

function getCurrentDateSheetName() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getSheetData() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './service.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // First, get the sheet title
    const sheetTitle = getCurrentDateSheetName();
    
    // Try to get data from the sheet with current date name
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${sheetTitle}!A:Z`, // Get all columns from A to Z
      });
      return response.data.values;
    } catch (error) {
      // If sheet doesn't exist, return empty data
      console.log(`Sheet "${sheetTitle}" not found. Creating new sheet...`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

app.get('/api/sheet-data', async (req, res) => {
  try {
    const data = await getSheetData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 