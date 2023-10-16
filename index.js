const { greenBright, redBright, yellowBright, bold } = require('chalk')

const { google } = require('googleapis');

module.exports = class SheetFlow {
    constructor({ credentials, sheet: { id, name, range } }) {
        this.authClient = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        )
        this.sheetsAPI = google.sheets({ version: 'v4', auth: this.authClient })
        this.tab = name
        this.range = range
        this.spreadsheetId = id
    }

    async connect() {
        await this.authClient.authorize();
        console.log(`[SheetFlow] ${bold(greenBright('Connected to Google Sheets API'))}`);
    }

    async read() {
        const spreadsheetId = this.spreadsheetId
        const range = this.range
        const response = await this.sheetsAPI.spreadsheets.values.get({
            spreadsheetId,
            range,
        })

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return `[SheetFlow] ${bold(redBright('Err: No data found.'))}`
        }

        const headerRow = rows[0];
        const data = rows.slice(1).map((row) => {
            const rowData = {};
            row.forEach((cell, index) => {
                rowData[headerRow[index]] = cell;
            })
            return rowData
        })

        return data
    }

    async write(data) {
        const values = Object.values(data)
        const spreadsheetId = this.spreadsheetId
        const range = this.range
        this.sheetsAPI.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [values],
            },
        })
        return `[SheetFlow] ${bold(greenBright('Wrote to spreadsheet.'))}`
    }

    async update(data) {
        const spreadsheetId = this.spreadsheetId
        const range = this.range
        try {
            const response = await this.sheetsAPI.spreadsheets.values.get({
                spreadsheetId,
                range: range,
            });

            const rows = response.data.values

            if (rows.length === 0) {
                return `[SheetFlow] ${bold(redBright('Err: No data found.'))}`
            }

            const headers = rows[0]
            const columnIndex = headers.indexOf(Object.keys(data)[0]);

            if (columnIndex === -1) {
                return `[SheetFlow] ${bold(redBright('Err: Column not found.'))}`
            }

            for (let i = 1; i < rows.length; i++) {
                if (rows[i][columnIndex] === data[Object.keys(data)[0]]) {
                    for (let j = 1; j < headers.length; j++) {
                        if (Object.keys(data).includes(headers[j])) {
                            rows[i][j] = data[headers[j]];
                        }
                    }
                    break;
                }
            }

            this.sheetsAPI.spreadsheets.values.update({
                spreadsheetId,
                range: range, // Modify the sheet name if necessary
                valueInputOption: 'RAW',
                resource: {
                    values: rows,
                },
            })

            return `[SheetFlow] ${bold(greenBright('Updated spreadsheet data.'))}`
        } catch (e) {
            console.error('[SheetFlow] Err updating data: ', e)
        }
    }



    async delete(rowIndex) {
        const spreadsheetId = this.spreadsheetId
        const response = await this.sheetsAPI.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: 'ROWS',
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1,
                            },
                        },
                    },
                ],
            },
        })

        return `[SheetFlow] ${yellowBright(`Deleted row ${response.data.replies.length}`)}`
    }

    async search(query) {
        const spreadsheetId = this.spreadsheetId
        const range = this.range
        const response = await this.sheetsAPI.spreadsheets.values.get({
            spreadsheetId,
            range,
        })

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log(`[SheetFlow] ${bold(redBright('Err: No data found.'))}`)
            return []
        }

        const headerRow = rows[0];
        const Data = rows.slice(1).filter((row) => {
            return row.some((cell) => cell.includes(query));
        }).map((row) => {
            const rowData = {};
            row.forEach((cell, index) => {
                rowData[headerRow[index]] = cell;
            });
            return rowData
        })

        return Data
    }
}