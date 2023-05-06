import { google, sheets_v4 } from 'googleapis';

const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4' });

interface AppendValuesParams extends sheets_v4.Params$Resource$Spreadsheets$Values$Append {
    resource: {
        values: string[][];
    };
}

async function writeValues(
    auth: any,
    SpreadSheetID: string,
    range: string,
    values: string[]
): Promise<void> {
    const resource = {
        values: [values],
    };

    const params: AppendValuesParams = {
        auth,
        spreadsheetId: SpreadSheetID,
        range,
        valueInputOption: 'USER_ENTERED',
        resource,
    };

    await sheets.spreadsheets.values.append(params);
}

async function setValues(
    auth: any,
    SpreadSheetID: string,
    data: string[],
    sheet: string,
    range: string
): Promise<void> {
    const cellRange = `${sheet}!${range}`;
    const values = data;

    await writeValues(auth, SpreadSheetID, cellRange, values);
}

export default setValues
