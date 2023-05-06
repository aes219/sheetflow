const SheetFlow = require("sheetflow");

const options = {
  sheet: {
    name: 'Sheet1',
    id: 'YOUR_SHEET_ID',
    range: 'A:Z',
  },
  keyFile: 'YOUR_KEY_FILE.json',
};

const db = new SheetFlow(options);

async function main() {
  await db.authorize();

  // Read data
  db.read('1', 'Column1');

  // Write data
  const data = [
    ['Name', 'Age'],
    ['John', '25'],
    ['Jane', '30'],
  ];
  db.write(data);

  // Update data
  db.update('1', 'Column1', 'Updated Value');
}

main();
