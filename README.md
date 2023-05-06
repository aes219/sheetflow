# SheetFlow
A lightweight easy-to-use package that allows you to easily use spreadsheet as a database

## Features
- Easy to use methods
- Create multiple instances
- Data encryption coming soon

### Basic Usage:
```js
const SheetFlow = require('sheetflow');

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

```
#### [**Example File**](https://github.com/rungtavaidik/sheetflow/blob/main/example/myapp.js)

### Options
```js
const SheetFlow = require("sheetflow");
const db = new SheetFlow({
    sheet: {
        name: 'Sheet1', //Sheet name, you can create multiple databases in one doc!
        id: 'YOUR_SHEET_ID', //Google Sheet URL ID
        range: 'A:Z', //Sheet Range, set it according to your needs
    },
  keyFile: 'YOUR_KEY_FILE.json', //serviceAccount keyFile. Get it from https://console.cloud.google.com
})
```
### Methods

- **write**
```js
  db.write(['1', 'foo', 'bar']);
```

- **read**
```js
  db.read('1', 'foo'); // returns bar
```

- **update**
```js
  db.read('1', 'foo', 'barr');
```
