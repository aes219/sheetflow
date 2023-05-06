import chalk from "chalk";
import connect from "./class/authorize";
import read from "./class/read";
import setValues from "./class/write";
import updateValue from "./class/update";

class SheetFlow {
    private sheetName: string;
    private keyFile: string;
    private sheetID: string;
    private range: string;
    private auth: any;

    constructor(options: { sheet: { name: string; id: string; range: string }; keyFile: string }) {
        this.sheetName = options.sheet.name;
        this.keyFile = options.keyFile;
        this.sheetID = options.sheet.id;
        this.range = options.sheet.range;
        if (!this.sheetName)
            console.log(`${ chalk.red('SheetFlow Err: A sheet name must be specified in the constructor options') }`);
        if (!this.sheetID)
            console.log(`${ chalk.red('SheetFlow Err: A sheet id must be specified in the constructor options') }`);
        if (!this.range)
            console.log(`${ chalk.red('SheetFlow Err: A sheet range must be specified in the constructor options') }`);
        if (!this.keyFile)
            console.log(`${ chalk.red('SheetFlow Err: keyFile File must be specified in the constructor options') }`);
    }

    async authorize(): Promise<void> {
        this.auth = await connect(this.keyFile);
        console.log(`${chalk.green('SheetFlow: Authorized with googleapis')}`);
    }

    read(id: string, key: string): void {
        read(this.auth, this.sheetID, id, key, this.sheetName);
    }

    write(data: string[]): void {
        setValues(this.auth, this.sheetID, data, this.sheetName, this.range);
    }

    update(id: string, key: string, newValue: string): void {
        updateValue(this.auth, this.sheetID, id, key, newValue, this.sheetName, this.range);
    }
}

export default SheetFlow