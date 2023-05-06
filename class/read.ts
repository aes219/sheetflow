import { google, sheets_v4 } from 'googleapis';

const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4' });

async function scanDoc(
  auth: any,
  SpreadSheetID: string,
  range: string
): Promise<string[][]> {
  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: SpreadSheetID,
    range,
  });

  return response.data.values as string[][];
}

async function read(
  auth: any,
  SpreadSheetID: string,
  key: string,
  value: string,
  sheet: string
): Promise<string | null> {
  const values = await scanDoc(auth, SpreadSheetID, `${sheet}!A:Z`);
  const headers = values[0];
  const keyIndex = headers.indexOf('key');
  const valueIndex = headers.indexOf(value);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[keyIndex] === key) {
      return row[valueIndex];
    }
  }

  return null;
}

export default read
