import { google, sheets_v4 } from 'googleapis';

const sheets = google.sheets({ version: 'v4' });

async function updateValue(
  auth: any,
  SpreadSheetID: string,
  key: string,
  value: string,
  newValue: string,
  sheet: string,
  cellRange: string,
): Promise<string> {
  try {
    const findRowRequest: sheets_v4.Params$Resource$Spreadsheets$Values$Get = {
      spreadsheetId: SpreadSheetID,
      range: `${sheet}!${cellRange}`,
      auth,
    };
    const findRowResponse = await sheets.spreadsheets.values.get(findRowRequest);
    const rows = findRowResponse.data.values;
    const rowIndex = rows?.findIndex(row => row[0] === key) ?? -1;

    if (rowIndex === -1) {
      return `No entry found by the key name ${key}`;
    }
    if (!rows) {
      return `No values found for range ${cellRange}`;
    }
    const keyIndex = rows[0].indexOf(value);
    if (keyIndex === -1) {
      return `No column found by the name ${value}`;
    }
    const column = String.fromCharCode(keyIndex + 65);
    const range = `${sheet}!${column}${rowIndex + 1}`;

    const updateRequest = {
      auth: auth,
      spreadsheetId: SpreadSheetID,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        range: range,
        values: [[newValue]],
      },
    };
    await sheets.spreadsheets.values.update(updateRequest);
  } catch (e) {
    console.log(e.message);
  }

  return '';
}

export default updateValue
